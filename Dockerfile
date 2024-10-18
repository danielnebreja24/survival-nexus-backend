# Use a Node.js base image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies (both production and development)
RUN yarn install

# Copy the rest of your application code
COPY . .

# Expose the port your app runs on (replace with your actual port if different)
EXPOSE 5000

# Start the application
CMD ["yarn", "start"]
