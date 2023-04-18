# Dockerfile

# Use the official Node.js image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the source code to the working directory
COPY src src
COPY webpack.config.js webpack.config.js
COPY tsconfig.json tsconfig.json

# Expose the port that the game server will run on
EXPOSE 3000

# Run the game server
CMD ["npm", "start"]
