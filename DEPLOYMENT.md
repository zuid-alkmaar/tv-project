# Community TV Display - Deployment Guide

## 🎯 Quick Deployment for Raspberry Pi Zero 2

Your Raspberry Pi Zero 2 is perfect for this project! Here's the fastest way to get your community TV display running.

### Option 1: Automated Deployment (Recommended)

1. **On your development machine** (where you have this project):
   ```bash
   # Build the project
   npm run build
   
   # Deploy to your Pi (replace with your Pi's IP)
   ./scripts/deploy-to-pi.sh 192.168.1.100
   ```

2. **Connect your Pi to the TV** via HDMI and power it on.

3. **Done!** Your slideshow should start automatically.

### Option 2: Manual Setup

If you prefer to set up manually:

1. **Prepare your Raspberry Pi:**
   ```bash
   # Copy the setup script to your Pi
   scp scripts/pi-setup.sh pi@your-pi-ip:/home/pi/
   
   # SSH into your Pi and run setup
   ssh pi@your-pi-ip
   chmod +x pi-setup.sh
   ./pi-setup.sh
   ```

2. **Build and transfer your app:**
   ```bash
   # On your development machine
   npm run build
   scp -r dist/* pi@your-pi-ip:/home/pi/tv-display/
   ```

3. **Start the services on Pi:**
   ```bash
   # SSH into your Pi
   ssh pi@your-pi-ip
   
   # Start the web server
   cd /home/pi/tv-display
   serve -s . -l 3000 &
   
   # Start kiosk mode (if you have a desktop environment)
   DISPLAY=:0 /home/pi/start-kiosk.sh
   ```

## 🔧 Configuration

### Adding Real Weather Data

1. Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Create `.env` file:
   ```bash
   cp .env.example .env
   ```
3. Add your API key:
   ```
   VITE_WEATHER_API_KEY=your_api_key_here
   ```
4. Rebuild and redeploy:
   ```bash
   npm run build
   ./scripts/deploy-to-pi.sh your-pi-ip
   ```

### Customizing Content

Edit `src/config/config.ts` to change:
- Slide duration (default: 15 seconds)
- Community center name
- Location coordinates
- Update intervals

### Adding New Screens

1. Create a new component in `src/components/screens/`
2. Add it to the `screens` array in `src/components/Slideshow.tsx`
3. Rebuild and redeploy

## 🚀 Performance Tips for Pi Zero 2

Your Pi Zero 2 will run this smoothly with these optimizations:

1. **Use a fast MicroSD card** (Class 10 or better)
2. **Ensure adequate power supply** (2.5A recommended)
3. **Use Raspberry Pi OS Lite** for better performance
4. **Keep the Pi cool** - consider a small heatsink

## 🔍 Troubleshooting

### Common Issues

**Blank screen:**
- Check if web server is running: `curl http://localhost:3000`
- Verify HDMI connection and TV input

**Slow performance:**
- Check power supply (red lightning bolt icon = insufficient power)
- Verify MicroSD card speed
- Monitor CPU temperature: `vcgencmd measure_temp`

**No internet data:**
- Check WiFi connection: `ping google.com`
- Verify API keys in `.env` file

### Useful Commands

```bash
# Check web server status
sudo systemctl status tv-display

# Restart web server
sudo systemctl restart tv-display

# View logs
sudo journalctl -u tv-display -f

# Check system resources
htop

# Test display without kiosk mode
chromium-browser http://localhost:3000
```

## 🎨 Customization Ideas

- Add local news feeds
- Include community event calendars
- Show social media feeds
- Display emergency announcements
- Add QR codes for community resources

## 📱 Remote Management

Once deployed, you can:
- SSH into your Pi for updates
- Use VNC for remote desktop access
- Set up automatic updates via cron jobs
- Monitor via web-based tools

## 🔄 Updates

To update the display:
1. Make changes to your code
2. Run `./scripts/deploy-to-pi.sh your-pi-ip`
3. The display will automatically show the new version

## 📞 Support

If you need help:
1. Check the troubleshooting section above
2. Review the logs with `sudo journalctl -u tv-display -f`
3. Test individual components in development mode

Your community TV display is now ready to inform and engage your visitors! 🎉
