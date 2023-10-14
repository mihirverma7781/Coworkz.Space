# Use the official Node.js Alpine base image
FROM node:alpine

# Set the working directory in the container
WORKDIR /app

# Install pnpm globally (optional but recommended)
RUN npm install -g pnpm

# Copy the package.json and pnpm-lock files to the container
COPY . .

# Install project dependencies using pnpm
RUN pnpm install

# Run the service
CMD ["pnpm","start"]
