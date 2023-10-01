FROM oven/bun:1.0.3-alpine as base

WORKDIR /app

# Build stage
FROM base as build

# Copy the package json and bun.lockb to download the dependencies
COPY package.json .
COPY bun.lockb .

RUN bun install

# Copy all of the files from the client directory into the image
COPY . .

# Bundle the project into an executable file
RUN bun build src/scheduler/index.ts --outfile scheduler.js --target bun

# Runner stage
FROM base as run

# Copy the scheduler bundle from the build stage to the image
COPY --from=build /app/scheduler.js .

# Set the timezone to Europe/Prague
ENV TZ=Europe/Prague

# Run the scheduler
CMD ["bun", "run", "./scheduler.js"]
