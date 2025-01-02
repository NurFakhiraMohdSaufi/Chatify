# Use an official Node.js runtime as a base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the entire application to the container
COPY . .

# Set the environment variable
ENV NODE_ENV=development

# Expose the port of the app will run on
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "dev"]
