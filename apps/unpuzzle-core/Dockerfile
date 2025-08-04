# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Python 3 and other necessary build dependencies using apk
RUN apk update && apk add --no-cache \
    python3 \
    py3-pip \
    python3-dev \
    build-base \
    && rm -rf /var/cache/apk/*

# Ensure python points to python3
RUN ln -sf /usr/bin/python3 /usr/bin/python

# Verify Python 3.x and pip installation
RUN python --version
RUN pip --version

# Install all dependencies (including dev dependencies)
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Python 3 for runtime dependencies
RUN apk update && apk add --no-cache \
    python3 \
    && rm -rf /var/cache/apk/*

# Install only production dependencies
RUN npm install --only=production

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Set environment variables
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=512"

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]