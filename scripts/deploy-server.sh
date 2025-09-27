#!/bin/bash

# Community TV Display - Server Deployment Script
# This script builds and prepares the app for server deployment

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_status "Building Community TV Display for server deployment..."

# Step 1: Install dependencies
print_status "Installing dependencies..."
npm install

# Step 2: Build the project
print_status "Building the project..."
npm run build

# Step 3: Create deployment package
print_status "Creating deployment package..."
if [ -d "deployment" ]; then
    rm -rf deployment
fi

mkdir deployment
cp -r dist/* deployment/

# Step 4: Create simple server files
print_status "Creating server configuration files..."

# Create a simple Node.js server
cat > deployment/server.js << 'EOF'
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('.'));

// Handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Community TV Display server running on port ${PORT}`);
  console.log(`Access at: http://localhost:${PORT}`);
});
EOF

# Create package.json for the server
cat > deployment/package.json << 'EOF'
{
  "name": "community-tv-display-server",
  "version": "1.0.0",
  "description": "Community TV Display Server",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
EOF

# Create Docker file for containerized deployment
cat > deployment/Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json .
RUN npm install --production

# Copy built application
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
EOF

# Create docker-compose for easy deployment
cat > deployment/docker-compose.yml << 'EOF'
version: '3.8'
services:
  community-tv-display:
    build: .
    ports:
      - "3000:3000"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
EOF

# Create nginx configuration
cat > deployment/nginx.conf << 'EOF'
server {
    listen 80;
    server_name _;
    root /var/www/html;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF

print_status "Deployment package created successfully!"
print_status ""
print_status "📁 Deployment files created in './deployment/' folder:"
print_status "   • Built application files"
print_status "   • server.js (Node.js/Express server)"
print_status "   • Dockerfile (for containerized deployment)"
print_status "   • docker-compose.yml (for easy Docker deployment)"
print_status "   • nginx.conf (for nginx deployment)"
print_status ""
print_status "🚀 Deployment options:"
print_status ""
print_status "1. Simple Node.js server:"
print_status "   cd deployment && npm install && npm start"
print_status ""
print_status "2. Docker deployment:"
print_status "   cd deployment && docker-compose up -d"
print_status ""
print_status "3. Static file hosting:"
print_status "   Upload all files (except server.js, Dockerfile) to your web server"
print_status ""
print_status "4. Netlify/Vercel:"
print_status "   Upload the 'dist' folder or connect your Git repository"
print_status ""
print_status "✅ Your Community TV Display is ready for server deployment!"
