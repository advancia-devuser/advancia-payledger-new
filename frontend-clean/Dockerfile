# Use Node.js 20 LTS (as specified in package.json engines)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Create .next directory for development
RUN mkdir -p .next

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# For development, we'll use npm run dev
# For production, you would use: RUN npm run build && CMD ["npm", "start"]
CMD ["npm", "run", "dev"]
