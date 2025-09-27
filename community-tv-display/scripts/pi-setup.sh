#!/bin/bash

# Raspberry Pi Setup Script for Community TV Display
# Run this script on your Raspberry Pi to set it up for kiosk mode

set -e

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

print_status "Setting up Raspberry Pi for Community TV Display..."

# Update system
print_status "Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install required packages
print_status "Installing required packages..."
sudo apt-get install -y \
    chromium-browser \
    unclutter \
    curl \
    git

# Install Node.js
print_status "Installing Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    print_status "Node.js already installed: $(node --version)"
fi

# Install serve globally
print_status "Installing serve package..."
sudo npm install -g serve

# Configure GPU memory split for better performance
print_status "Configuring GPU memory split..."
if ! grep -q "gpu_mem=128" /boot/config.txt; then
    echo "gpu_mem=128" | sudo tee -a /boot/config.txt
    print_warning "GPU memory split configured. Reboot required for changes to take effect."
fi

# Disable screen blanking
print_status "Disabling screen blanking..."
if ! grep -q "consoleblank=0" /boot/cmdline.txt; then
    sudo sed -i 's/$/ consoleblank=0/' /boot/cmdline.txt
fi

# Configure X11 to disable screen saver
print_status "Configuring X11 settings..."
mkdir -p /home/pi/.config/autostart

# Create X11 configuration to disable screensaver
cat > /home/pi/.xsessionrc << 'EOF'
# Disable screen saver and power management
xset s off
xset -dpms
xset s noblank
EOF

# Create autostart entry to disable screensaver
cat > /home/pi/.config/autostart/disable-screensaver.desktop << 'EOF'
[Desktop Entry]
Type=Application
Name=Disable Screensaver
Exec=bash -c 'xset s off; xset -dpms; xset s noblank'
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
EOF

# Configure automatic login (optional)
print_status "Configuring automatic login..."
sudo raspi-config nonint do_boot_behaviour B4

# Create directories
print_status "Creating application directories..."
mkdir -p /home/pi/tv-display
mkdir -p /home/pi/scripts

# Set proper permissions
chown -R pi:pi /home/pi/tv-display
chown -R pi:pi /home/pi/scripts

print_status "Basic Raspberry Pi setup completed!"
print_status ""
print_status "Next steps:"
print_status "1. Deploy your application files to /home/pi/tv-display/"
print_status "2. Use the deploy-to-pi.sh script from your development machine"
print_status "3. Reboot the Pi to apply all changes: sudo reboot"
print_status ""
print_status "Optional: Enable SSH for remote management:"
print_status "  sudo systemctl enable ssh"
print_status "  sudo systemctl start ssh"
