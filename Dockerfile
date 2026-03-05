# Stage 1: Build the React app
FROM node:18-alpine as build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy app files and build
COPY . .
RUN npm run build

# Stage 2: Serve with Node.js
FROM node:18-alpine

WORKDIR /app

# Copy built frontend
COPY --from=build /app/dist ./dist

# Copy server and package files
COPY package.json package-lock.json server.js ./

# Install only production dependencies (this will include express)
RUN npm install --omit=dev

# Create data directory for volume mapping
RUN mkdir -p data

# Expose port (default 3000 as per server.js)
EXPOSE 3000

CMD ["node", "server.js"]
