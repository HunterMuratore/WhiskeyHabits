# Use the official Node.js image for building the client
FROM node:21-alpine AS client

# Set the working directory for the client
WORKDIR /app/client

# Copy client package.json and package-lock.json to the working directory
COPY client/package*.json ./

# Install client dependencies
RUN npm install

# Copy the rest of the client application code
COPY client/ .

# Build the React app
RUN npm run build

# Switch to a new stage for the server
FROM node:21-alpine AS server

# Set the working directory for the server
WORKDIR /app/server

# Copy server package.json and package-lock.json to the working directory
COPY server/package*.json ./

# Install server dependencies
RUN npm install

# Copy the rest of the server application code
COPY server/ .

# Expose the port for the server
EXPOSE 3000

# Command to run the server
CMD ["npm", "start"]
