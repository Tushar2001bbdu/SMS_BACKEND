#!/bin/bash

# Update and upgrade the system
sudo apt-get update -y && sudo apt-get upgrade -y

# Install Node.js and npm
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Git
sudo apt-get install -y git

# Install PM2 to manage the app
sudo npm install pm2@latest -g

# Clone the repository (replace with your repo URL)
cd /home/ubuntu
git clone 

# Navigate to the app directory
cd your-repo

# Install app dependencies
npm install

# Set up environment variables (optional, can be skipped if using .env)
export NODE_ENV=production
export PORT=3000

# Start the Node.js app using PM2
pm2 start app.js --name "your-app-name" --env production

# Save PM2 process list and enable startup
pm2 save
pm2 startup

# Install Nginx as a reverse proxy
sudo apt-get install -y nginx

# Configure Nginx
sudo tee /etc/nginx/sites-available/default > /dev/null <<EOL
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

# Restart Nginx to apply the configuration
sudo systemctl restart nginx

# Enable firewall and allow Nginx
sudo ufw allow 'Nginx Full'
sudo ufw enable
