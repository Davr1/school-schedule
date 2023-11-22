FROM oven/bun:1.0.13 as base

WORKDIR /app

# Build stage
FROM base as build

# Copy the package json, TODO: copy pnpm-lock.yaml.
COPY api/package.json .

RUN bun install

# Copy all of the files from the api directory into the image
COPY ./api/tsconfig.json .
COPY ./api/src src/

# Bundle the project into an executable file
RUN bun build src/api/server.ts --outfile dist/index.js --target bun

# Runner stage
FROM base as run

# Copy the bundle from the build stage to the image
COPY --from=build /app/dist/index.js .

# Set the timezone to Europe/Prague
ENV TZ=Europe/Prague

# Run the api
CMD ["bun", "run", "./index.js"]
