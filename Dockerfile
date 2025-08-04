ARG BUILD_FROM
FROM ${BUILD_FROM}

ENV S6_BEHAVIOUR_IF_STAGE2_FAILS=exit

# Install InfluxDB3 and Node.js
RUN apk add --no-cache curl nodejs npm bash

# Install InfluxDB v3
RUN mkdir -p /opt/influxdb3 && \
    curl -L https://dl.influxdata.com/influxdb/releases/influxdb3-linux-amd64.tar.gz | \
    tar -xz -C /opt/influxdb3 --strip-components=1 && \
    ln -s /opt/influxdb3/influxdb3 /usr/bin/influxdb3

# Copy addon files
COPY rootfs / 
WORKDIR /app
RUN cd /app && npm install --omit=dev

# Use S6
SHELL ["/bin/bash", "-o", "pipefail", "-c"]
