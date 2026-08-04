# Use an official lightweight Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Install Wrangler globally for local testing or containerized deployments
RUN npm install -g wrangler

# Copy project files
COPY . .

# Expose port if running a local preview server
EXPOSE 8787

# Default command to run Wrangler dev preview
CMD ["wrangler", "dev"]
