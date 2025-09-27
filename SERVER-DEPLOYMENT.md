# Server Deployment Guide

## 🌐 Why Deploy on a Server?

**Benefits:**
- ✅ **No CORS issues** - API calls work perfectly
- ✅ **Always accessible** - 24/7 availability
- ✅ **Multiple displays** - One server, many screens
- ✅ **Easy updates** - Update once, affects all displays
- ✅ **Better performance** - Proper caching and optimization

## 🚀 Quick Deployment Options

### Option 1: Free Static Hosting (Easiest)

**Netlify (Recommended):**
1. Build your project: `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag and drop the `dist` folder
4. Get your URL (e.g., `https://your-app.netlify.app`)

**Vercel:**
1. Build your project: `npm run build`
2. Go to [vercel.com](https://vercel.com)
3. Import your project or upload `dist` folder
4. Get your URL

**GitHub Pages:**
1. Push your code to GitHub
2. Enable GitHub Pages in repository settings
3. Set source to GitHub Actions
4. Use the provided URL

### Option 2: Your Own Server

**Using the deployment script:**
```bash
# Run the deployment script
./scripts/deploy-server.sh

# Start the server
cd deployment
npm install
npm start

# Access at http://your-server-ip:3000
```

**Using Docker:**
```bash
# Build and run with Docker
./scripts/deploy-server.sh
cd deployment
docker-compose up -d

# Access at http://your-server-ip:3000
```

### Option 3: Raspberry Pi as Server

**Setup Pi as web server:**
```bash
# On your Pi
sudo apt update
sudo apt install nginx

# Copy built files to Pi
scp -r dist/* pi@your-pi-ip:/var/www/html/

# Configure nginx (use provided nginx.conf)
sudo cp nginx.conf /etc/nginx/sites-available/default
sudo systemctl restart nginx

# Access at http://your-pi-ip
```

## 🔧 Configuration for Server Deployment

### Environment Variables

Create `.env.production` file:
```bash
VITE_WEATHER_API_KEY=your_openweathermap_key
VITE_APP_TITLE=Buurthuis Overdie Ontmoet
```

### Build for Production

```bash
# Install dependencies
npm install

# Build optimized version
npm run build

# Test locally
npx serve -s dist
```

## 📱 Accessing from Raspberry Pi

Once deployed on a server, configure your Pi to display the web app:

**Method 1: Kiosk Mode**
```bash
# On your Pi, create startup script
cat > /home/pi/start-display.sh << 'EOF'
#!/bin/bash
export DISPLAY=:0
chromium-browser \
  --kiosk \
  --no-sandbox \
  --disable-infobars \
  https://your-server-url.com
EOF

chmod +x /home/pi/start-display.sh
```

**Method 2: Auto-start on boot**
```bash
# Add to /etc/rc.local (before exit 0)
sudo -u pi DISPLAY=:0 /home/pi/start-display.sh &
```

## 🌍 Recommended Hosting Services

### Free Options:
- **Netlify** - Best for static sites, automatic deployments
- **Vercel** - Great performance, easy setup
- **GitHub Pages** - Simple, integrated with Git
- **Firebase Hosting** - Google's hosting, very reliable

### Paid Options:
- **DigitalOcean** - $5/month droplet
- **AWS S3 + CloudFront** - Pay per use
- **Your own VPS** - Full control

## 🔄 Automatic Updates

### With Git Integration:
1. Connect your repository to Netlify/Vercel
2. Every push to main branch auto-deploys
3. Your TV display updates automatically

### Manual Updates:
1. Build locally: `npm run build`
2. Upload `dist` folder to your server
3. Display refreshes with new content

## 🛠️ Troubleshooting

**CORS Issues:**
- ✅ Solved automatically with server deployment
- No more API call problems

**Performance:**
- Enable gzip compression (included in nginx.conf)
- Use CDN for better global performance
- Cache static assets

**Monitoring:**
- Check server uptime
- Monitor API response times
- Set up alerts for downtime

## 📊 Server Requirements

**Minimum:**
- 1 CPU core
- 512MB RAM
- 1GB storage
- Basic web server (nginx/Apache)

**Recommended:**
- 2 CPU cores
- 1GB RAM
- 5GB storage
- CDN for better performance

## 🎯 Next Steps

1. **Choose deployment method** (Netlify recommended for simplicity)
2. **Build and deploy** your application
3. **Configure your Pi** to display the web app
4. **Test the setup** end-to-end
5. **Set up monitoring** for reliability

Your community TV display will be much more reliable and performant when deployed on a proper server! 🎉
