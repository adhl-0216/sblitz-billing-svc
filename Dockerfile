# Use the official Node.js image as the base image for building
FROM node:14 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install all dependencies (including dev dependencies for the build)
RUN npm install

# Build step
RUN npm run build

# Use a smaller Node.js image for production
FROM node:14 AS production

# Set the working directory inside the production container
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY package.json package-lock.json ./
COPY --from=builder /app/dist ./dist  

# Install only production dependencies
RUN npm install --only=production

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
