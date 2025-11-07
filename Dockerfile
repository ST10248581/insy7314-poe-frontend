# -------------------------
# Stage 1: Build React + Vite
# -------------------------
FROM node:18-slim AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the production app
RUN npm run build

# -------------------------
# Stage 2: Serve with Nginx
# -------------------------
FROM nginx:stable-slim

# Copy built files from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: custom nginx config for React Router (SPA)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
