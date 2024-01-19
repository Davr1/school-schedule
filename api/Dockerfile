FROM oven/bun:1.0.23 as base

WORKDIR /app

# Build stage
FROM base as build

# Copy the package json (As of rn, bun can't run pnpm. So I'm ignoring the pnpm-lock file)
COPY package.json .
# COPY pnpm-lock.yaml .

RUN bun install

# Copy files needed for the build
COPY ./tsconfig.json .
COPY ./src src/

# Bundle the project
RUN bun build src/api/server.ts --target bun --outfile dist/index.js --sourcemap

# Runner stage
FROM base as run

# Copy the bundle from the build stage to the image
COPY --from=build /app/dist/index.js .

# Set the timezone to Europe/Prague
ENV TZ=Europe/Prague

# Run the api
CMD ["bun", "run", "./index.js"]
