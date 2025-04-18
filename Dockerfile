
ARG BUILD_FROM=ghcr.io/home-assistant/amd64-base:3.16
FROM ${BUILD_FROM}

# Install dependencies with specific Node.js version
RUN apk add --no-cache nodejs npm python3 make g++

# Set working directory
WORKDIR /var/www

# Copy package files first (for better layer caching)
COPY package.json package-lock.json ./

# Install Node.js dependencies with increased memory limit
RUN npm install --unsafe-perm=true --allow-root

# Copy the rest of the app
COPY . .

# Build the React app
RUN npm run build

# Copy run script and make it executable
COPY run.sh /
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]
