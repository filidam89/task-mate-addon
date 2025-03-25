
ARG BUILD_FROM=ghcr.io/home-assistant/amd64-base:3.16
FROM ${BUILD_FROM}

# Install dependencies
RUN apk add --no-cache nodejs npm

# Copy app files
WORKDIR /var/www
COPY . /var/www/

# Install Node.js dependencies
RUN npm install
RUN npm run build

# Copy run script
COPY run.sh /
RUN chmod a+x /run.sh

# Install server dependencies
RUN npm install express cors http-proxy-middleware

CMD [ "/run.sh" ]
