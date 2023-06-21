# Use Node 20 (based on Alpine Linux)
# This is used for both the builder and the runner
FROM node:20-alpine as base

# The builder
# This install all packages and builds the app using vite
FROM base as builder

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json
# Note: I'm doing this before copying the rest of the files so Docker can cache the node_modules
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy the rest of the files
# See .dockerignore for what is not copied
COPY . .

# Build the app
RUN npm run build


# The runner
# This starts the node server using the app we built in the builder
FROM base as runner

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install the production dependencies
RUN npm ci --only=production

# Copy the built app from the builder
COPY --from=builder /app/build .

# Start the server
CMD ["node", "index.js"]
