
ARG BUILD_FROM=ghcr.io/home-assistant/amd64-base:3.16
FROM ${BUILD_FROM}

# Install dependencies with specific Node.js version and increase npm memory limit
ENV NODE_OPTIONS=--max_old_space_size=4096
ENV NPM_CONFIG_LOGLEVEL=error

# Install dependencies required for node-gyp
RUN apk add --no-cache nodejs npm python3 make g++ git

# Set working directory
WORKDIR /var/www

# Copy package files first (for better layer caching)
COPY package.json package-lock.json ./

# Install Node.js dependencies with increased memory limit and verbose output for debugging
RUN npm install --unsafe-perm=true --allow-root --verbose

# Copy the rest of the app
COPY . .

# Build the React app
RUN npm run build

# Copy run script and make it executable
COPY run.sh /
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]
