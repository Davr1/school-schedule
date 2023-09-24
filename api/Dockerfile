# Build stage (uses Bun to build the project)
FROM oven/bun:1.0.1 as build

WORKDIR /app

# Copy the package json and bun.lockb to download the dependencies
COPY package.json .
COPY bun.lockb .

RUN bun install

# Copy all of the files from the client directory into the image
COPY . .

# Bundle the project into an executable file
RUN bun build src/index.ts --outfile scheduler --minify --compile

# Runner stage (Bun is no longer needed so I'm gonna use a smaller image)
FROM debian:bullseye-slim as run

WORKDIR /app

# Copy the scheduler executable from the build stage to the image
COPY --from=build /app/scheduler .

# Set the timezone to Europe/Prague
ENV TZ=Europe/Prague

# Proxy and log build arguments
ARG HTTPS_PROXY
ENV HTTPS_PROXY=$HTTPS_PROXY

ARG LOG=true
ENV LOG=$LOG

# Run the scheduler file
CMD ["./scheduler"]
