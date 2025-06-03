# Use official Alpine-based Node.js latest version image
FROM node:23-alpine


# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install


# Copy the rest of your app files
COPY . .

# Generate Prisma client 
RUN npm run generate

# Expose port your app runs on
EXPOSE 5500

# Start the app
CMD ["node", "src/app.js"]
