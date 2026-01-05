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

        // Try to fetch real-time data from OVapi with multiple fallback strategies
        let response;
        let data;

        try {
          // Strategy 1: Try nginx proxy (if configured on your server)
          response = await fetch('/api/ovapi/stopareacode/amrrfl/');
          if (response.ok) {
            data = await response.json();
          } else {
            throw new Error('Nginx proxy not available');
          }
        } catch (error) {
          console.log('Nginx proxy failed, trying direct API call...');
          try {
            // Strategy 2: Try direct API call
            response = await fetch('https://v0.ovapi.nl/stopareacode/amrafl/', {
              mode: 'cors',
            });
            if (response.ok) {
              data = await response.json();
            } else {
              throw new Error('Direct API call failed');
            }
          } catch (directError) {
            console.log('Direct API call failed, trying CORS proxy...');
            try {
              // Strategy 3: Use CORS proxy service
              response = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://v0.ovapi.nl/stopareacode/amrrfl/'));
              if (response.ok) {
                const proxyData = await response.json();
                data = JSON.parse(proxyData.contents);
              } else {
                throw new Error('CORS proxy failed');
              }
            } catch (proxyError) {
              console.log('All API strategies failed, using fallback data');
              throw new Error('All API calls failed');
            }
          }
        }

        // Data should already be parsed from the strategies above
        const apiData: OVApiResponse = data as OVApiResponse;
        const departures: BusDeparture[] = [];

        // Process all stops in the area
        Object.values(apiData).forEach(stopArea => {
          Object.values(stopArea).forEach(stop => {
            if (stop.Passes) {
              Object.values(stop.Passes).forEach(pass => {
                // Only include buses going to configured destinations
                if (config.transport.allowedDestinations.includes(pass.DestinationName50)) {

                  const expectedTime = new Date(pass.ExpectedDepartureTime);
                  const targetTime = new Date(pass.TargetDepartureTime);
                  const now = new Date();

                  // Subtract 5 minutes from the expected time for display
                  const adjustedTime = new Date(expectedTime.getTime() - (3 * 60 * 1000));

                  // Only show future departures (using adjusted time)
                  if (adjustedTime > now) {
                    // Calculate delay in minutes
                    const delayMs = expectedTime.getTime() - targetTime.getTime();
                    const delayMinutes = Math.round(delayMs / (1000 * 60));

                    // Determine platform based on timing point code
                    const platform = pass.TimingPointCode === '36000240' ? 'A' : 'B';

                    departures.push({
                      line: pass.LinePublicNumber,
                      destination: pass.DestinationName50,
                      departureTime: adjustedTime.toLocaleTimeString('nl-NL', {
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
            line: 'X',
            destination: 'Geen Data',
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
        <div className="text-4xl animate-pulse text-violet-200">Loading bus times...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full text-white p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-2 text-violet-100">🚌 Vertrektijden</h1>
        <div className="text-2xl text-gray-300">{config.transport.stopName}</div>
        <div className="text-sm text-gray-400 mt-2">
          Laatste update: {lastUpdated.toLocaleTimeString('nl-NL')}
        </div>
      </div>

      {/* Departures Table */}
      <div className="flex-1">
        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-600/30 rounded-3xl overflow-hidden shadow-2xl">
          {/* Table Header */}
          <div className="grid grid-cols-4 gap-4 p-4 bg-violet-600/20 border-b border-violet-400/30 text-2xl font-semibold text-violet-100">
            <div>Lijn</div>
            <div className="col-span-2">Bestemming</div>
            <div>Tijd</div>
          </div>

          {/* Departures */}
          <div className="divide-y divide-gray-700/50">
            {departures.length === 0 ? (
              <div className="p-8 text-center text-xl text-gray-400">
                Geen busritten beschikbaar.
              </div>
            ) : (
              departures.map((departure, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 p-4 text-3xl hover:bg-violet-500/10 transition-all duration-200">
                  <div className="flex items-center">
                    <span className="bg-violet-600 text-white px-3 py-1 rounded-full font-bold shadow-lg">
                      {departure.line}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center text-gray-200">
                    {departure.destination}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={departure.delay > 0 ? 'text-red-400 font-semibold' : 'text-green-400 font-semibold'}>
                      {departure.departureTime}
                    </span>
                    {departure.delay > 0 && (
                      <span className="bg-red-500/80 text-white text-md px-2 py-1 rounded-md">
                        +{departure.delay}m
                      </span>
                    )}&nbsp;
                    {departure.status === 'DRIVING' && (
                      <span className="bg-violet-500/80 text-white text-md px-2 py-1 rounded-md">
                        Onderweg
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-6 text-lg text-gray-400">
        Actuele bustijden • Controleer deze pagina voor updates!
      </div>
    </div>
  );
};

export default BusTimesScreen;
