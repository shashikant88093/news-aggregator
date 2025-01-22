# Use the official Node.js image as the base image
FROM node:20.15.0

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the React app
RUN npm run build

# Install serve to serve the build
RUN npm install -g serve

# Set the command to run the app
CMD ["serve", "-s", "build"]

# Expose the port the app runs on
EXPOSE 5000