# -------------------------
# Stage 1: Build React + Vite
# -------------------------
FROM node:18-slim AS build

# Set working directory
WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Ensure local binaries are executable
RUN chmod +x ./node_modules/.bin/*

# Add local binaries to PATH
ENV PATH=/app/node_modules/.bin:$PATH

# Copy the rest of the project
COPY . .

# Build the app
RUN npm run build

# -------------------------
# Stage 2: Serve with Nginx
# -------------------------
FROM nginx:stable

# Copy build output from previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: SPA routing (uncomment if using React Router)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
