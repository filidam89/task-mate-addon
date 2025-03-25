
#!/usr/bin/with-contenv bashio

# Create the directory structure
mkdir -p /app

# Copy the web application to the /app directory
cp -r /data/options.json /app/
cp -r /var/www/* /app/

# Start the web server
cd /app
exec node server.js
