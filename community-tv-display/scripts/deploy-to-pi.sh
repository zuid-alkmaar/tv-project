#!/bin/bash

# Community TV Display - Raspberry Pi Deployment Script
# This script helps deploy the application to a Raspberry Pi

set -e

# Configuration
PI_USER="pi"
PI_HOST=""
PI_PATH="/home/pi/tv-display"
LOCAL_BUILD_DIR="dist"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if PI_HOST is provided
if [ -z "$1" ]; then
    print_error "Please provide the Raspberry Pi IP address or hostname"
    echo "Usage: $0 <pi-ip-address>"
    echo "Example: $0 192.168.1.100"
    exit 1
fi

PI_HOST=$1

print_status "Starting deployment to Raspberry Pi at $PI_HOST"

# Step 1: Build the project
print_status "Building the project..."
if ! npm run build; then
    print_error "Build failed!"
    exit 1
fi

# Step 2: Check if Pi is reachable
print_status "Checking if Raspberry Pi is reachable..."
if ! ping -c 1 "$PI_HOST" > /dev/null 2>&1; then
    print_error "Cannot reach Raspberry Pi at $PI_HOST"
    exit 1
fi

# Step 3: Create directory on Pi
print_status "Creating directory on Raspberry Pi..."
ssh "$PI_USER@$PI_HOST" "mkdir -p $PI_PATH"

# Step 4: Transfer files
print_status "Transferring files to Raspberry Pi..."
scp -r "$LOCAL_BUILD_DIR"/* "$PI_USER@$PI_HOST:$PI_PATH/"

# Step 5: Install dependencies on Pi (if needed)
print_status "Setting up web server on Raspberry Pi..."
ssh "$PI_USER@$PI_HOST" << 'EOF'
# Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install serve globally if not present
if ! command -v serve &> /dev/null; then
    echo "Installing serve..."
    sudo npm install -g serve
fi

# Install Chromium if not present
if ! command -v chromium-browser &> /dev/null; then
    echo "Installing Chromium browser..."
    sudo apt-get update
    sudo apt-get install -y chromium-browser unclutter
fi
EOF

# Step 6: Create startup scripts
print_status "Creating startup scripts..."
ssh "$PI_USER@$PI_HOST" << EOF
# Create kiosk startup script
cat > /home/pi/start-kiosk.sh << 'KIOSK_EOF'
#!/bin/bash
export DISPLAY=:0

# Hide cursor
unclutter -idle 0.5 -root &

# Start Chromium in kiosk mode
chromium-browser \\
  --kiosk \\
  --no-sandbox \\
  --disable-infobars \\
  --disable-session-crashed-bubble \\
  --disable-component-extensions-with-background-pages \\
  --disable-extensions \\
  --disable-features=TranslateUI \\
  --disable-ipc-flooding-protection \\
  --disable-renderer-backgrounding \\
  --disable-backgrounding-occluded-windows \\
  --force-device-scale-factor=1 \\
  --disable-dev-shm-usage \\
  --disable-gpu \\
  http://localhost:3000
KIOSK_EOF

chmod +x /home/pi/start-kiosk.sh

# Create web server startup script
cat > /home/pi/start-webserver.sh << 'SERVER_EOF'
#!/bin/bash
cd $PI_PATH
serve -s . -l 3000
SERVER_EOF

chmod +x /home/pi/start-webserver.sh
EOF

# Step 7: Create systemd service for auto-start
print_status "Creating systemd service for auto-start..."
ssh "$PI_USER@$PI_HOST" << 'EOF'
# Create systemd service for web server
sudo tee /etc/systemd/system/tv-display.service > /dev/null << 'SERVICE_EOF'
[Unit]
Description=Community TV Display Web Server
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/tv-display
ExecStart=/usr/bin/serve -s . -l 3000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
SERVICE_EOF

# Enable and start the service
sudo systemctl daemon-reload
sudo systemctl enable tv-display.service
sudo systemctl start tv-display.service

# Create autostart for kiosk mode (if running desktop)
mkdir -p /home/pi/.config/autostart
cat > /home/pi/.config/autostart/tv-display.desktop << 'DESKTOP_EOF'
[Desktop Entry]
Type=Application
Name=TV Display Kiosk
Exec=/home/pi/start-kiosk.sh
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
DESKTOP_EOF
EOF

print_status "Deployment completed successfully!"
print_status "The TV display should now be accessible at http://$PI_HOST:3000"
print_status ""
print_status "Next steps:"
print_status "1. Connect your Pi to the TV via HDMI"
print_status "2. If using desktop environment, the kiosk will auto-start on login"
print_status "3. For headless setup, you can manually start kiosk mode with:"
print_status "   ssh $PI_USER@$PI_HOST 'DISPLAY=:0 /home/pi/start-kiosk.sh'"
print_status ""
print_status "To check the web server status:"
print_status "   ssh $PI_USER@$PI_HOST 'sudo systemctl status tv-display'"
