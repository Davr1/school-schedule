# Use Node 20 
FROM node:20-slim as base

# pnpm setup ig
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

# Don't download Google Chrome here!
# You should run a chromium instance in a separate container and set
# the PUPPETEER_BROWSER_URL env variable to that container's address
ENV PUPPETEER_SKIP_DOWNLOAD true

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json
# Note: I'm doing this before copying the rest of the files so Docker can cache the node_modules
COPY package.json .
COPY pnpm-lock.yaml .
COPY patches ./patches 

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# The builder
# This install all packages and builds the app using vite
FROM prod-deps as builder

# Install all dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy the rest of the files
# See .dockerignore for what is not copied
COPY . .

# Set the environment variables (provided via args in compose)
ARG PROXY=""
ARG HOLIDAYS="TRUE"

ENV PROXY=${PROXY}
ENV HOLIDAYS=${HOLIDAYS}

# Run a check before building
RUN pnpm check

# Build the app
RUN pnpm build

# The runner
# This starts the node server using the app we built in the builder
FROM base as runner

# Get the production dependencies
COPY --from=prod-deps /app/node_modules /app/node_modules

# Copy the built app from the builder
COPY --from=builder /app/build .

# Start the server
CMD ["node", "index.js"]
