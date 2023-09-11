FROM oven/bun:1.0 as base

WORKDIR /app

FROM base as build

# Copy the package json and bun.lockb to download the dependencies
COPY package.json .
COPY bun.lockb .

RUN bun install

# Copy all of the files from the client directory into the image
COPY . .

# Bundle the project (log by default, can be disabled via the LOG build argument)
RUN bun build src/scheduler.ts --outfile scheduler.js --minify

FROM base as scheduler

# Copy the scheduler.js file from the build stage to the image
COPY --from=build /app/scheduler.js .

# Set the timezone to Europe/Prague
ENV TZ=Europe/Prague

# Proxy and log build arguments
ARG HTTPS_PROXY
ENV HTTPS_PROXY=$HTTPS_PROXY

ARG LOG=true
ENV LOG=$LOG

# Run the scheduler.js file
CMD ["bun", "run", "scheduler.js"]
