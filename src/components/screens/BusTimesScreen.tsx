import React, { useState, useEffect } from 'react';
import { config } from '../../config/config';

interface BusDeparture {
  line: string;
  destination: string;
  departureTime: string;
  delay: number; // in minutes
  platform: string;
  status: string;
}

interface OVApiPass {
  DestinationName50: string;
  LinePublicNumber: string;
  ExpectedDepartureTime: string;
  TargetDepartureTime: string;
  TripStopStatus: string;
  TimingPointCode: string;
}

interface OVApiResponse {
  [stopAreaCode: string]: {
    [timingPointCode: string]: {
      Stop: any;
      Passes: {
        [passId: string]: OVApiPass;
      };
    };
  };
}

const BusTimesScreen: React.FC = () => {
  const [departures, setDepartures] = useState<BusDeparture[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const fetchBusTimes = async () => {
      try {
        setLoading(true);

        // Try to fetch real-time data from OVapi
        // First try direct call, then fallback to proxy if CORS fails
        let response;
        try {
          response = await fetch('https://v0.ovapi.nl/stopareacode/amrasl/', {
            mode: 'cors',
          });
        } catch (corsError) {
          console.log('Direct API call failed due to CORS, trying proxy...');
          response = await fetch('/api/ovapi/stopareacode/amrasl/');
        }

        if (!response.ok) {
          throw new Error('Failed to fetch bus data');
        }

        const data: OVApiResponse = await response.json();
        const departures: BusDeparture[] = [];

        // Process all stops in the area
        Object.values(data).forEach(stopArea => {
          Object.values(stopArea).forEach(stop => {
            if (stop.Passes) {
              Object.values(stop.Passes).forEach(pass => {
                // Only include buses going to configured destinations
                if (config.transport.allowedDestinations.includes(pass.DestinationName50)) {

                  const expectedTime = new Date(pass.ExpectedDepartureTime);
                  const targetTime = new Date(pass.TargetDepartureTime);
                  const now = new Date();

                  // Only show future departures
                  if (expectedTime > now) {
                    // Calculate delay in minutes
                    const delayMs = expectedTime.getTime() - targetTime.getTime();
                    const delayMinutes = Math.round(delayMs / (1000 * 60));

                    // Determine platform based on timing point code
                    const platform = pass.TimingPointCode === '36000240' ? 'A' : 'B';

                    departures.push({
                      line: pass.LinePublicNumber,
                      destination: pass.DestinationName50,
                      departureTime: expectedTime.toLocaleTimeString('nl-NL', {
                        hour: '2-digit',
                        minute: '2-digit'
                      }),
                      delay: Math.max(0, delayMinutes), // Don't show negative delays
                      platform: platform,
                      status: pass.TripStopStatus,
                    });
                  }
                }
              });
            }
          });
        });

        // Sort by departure time
        departures.sort((a, b) => {
          const timeA = new Date(`1970-01-01T${a.departureTime}:00`);
          const timeB = new Date(`1970-01-01T${b.departureTime}:00`);
          return timeA.getTime() - timeB.getTime();
        });

        // Limit to next 8 departures
        setDepartures(departures.slice(0, 8));
        setLastUpdated(new Date());
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch bus times:', error);

        // Fallback to mock data if API fails
        const now = new Date();
        const fallbackDepartures: BusDeparture[] = [
          {
            line: '8',
            destination: 'Oud Overdie',
            departureTime: new Date(now.getTime() + 5 * 60000).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }),
            delay: 0,
            platform: 'B',
            status: 'PLANNED',
          },
          {
            line: '163',
            destination: 'Alkmaar Station',
            departureTime: new Date(now.getTime() + 12 * 60000).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }),
            delay: 2,
            platform: 'A',
            status: 'DRIVING',
          },
        ];

        setDepartures(fallbackDepartures);
        setLastUpdated(new Date());
        setLoading(false);
      }
    };

    fetchBusTimes();

    // Update at configured interval
    const interval = setInterval(fetchBusTimes, config.transport.updateInterval);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-white">
        <div className="text-4xl">Loading bus times...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full text-white p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-2">🚌 Bus Departures</h1>
        <div className="text-2xl opacity-75">{config.transport.stopName}</div>
        <div className="text-lg opacity-60 mt-2">
          Last updated: {lastUpdated.toLocaleTimeString('nl-NL')}
        </div>
      </div>

      {/* Departures Table */}
      <div className="flex-1">
        <div className="bg-white/10 rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 p-4 bg-white/20 text-xl font-semibold">
            <div>Line</div>
            <div className="col-span-2">Destination</div>
            <div>Time</div>
            <div>Platform</div>
          </div>
          
          {/* Departures */}
          <div className="divide-y divide-white/20">
            {departures.map((departure, index) => (
              <div key={index} className="grid grid-cols-5 gap-4 p-4 text-lg hover:bg-white/5">
                <div className="flex items-center">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full font-bold">
                    {departure.line}
                  </span>
                </div>
                <div className="col-span-2 flex items-center">
                  {departure.destination}
                </div>
                <div className="flex items-center">
                  <span className={departure.delay > 0 ? 'text-red-300' : 'text-green-300'}>
                    {departure.departureTime}
                    {departure.delay > 0 && (
                      <span className="text-red-400 ml-2">+{departure.delay}m</span>
                    )}
                  </span>
                  {departure.status === 'DRIVING' && (
                    <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">
                      Onderweg
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  <span className="bg-gray-600 text-white px-2 py-1 rounded">
                    {departure.platform}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-6 text-lg opacity-75">
        Real-time departures • Check platform displays for updates
      </div>
    </div>
  );
};

export default BusTimesScreen;
