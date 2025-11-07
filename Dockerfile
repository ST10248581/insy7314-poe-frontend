# -------------------------
# Stage 1: Build React + Vite
# -------------------------
FROM node:18-slim AS build

WORKDIR /app

# Copy package files first (better for caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the project
COPY . .

# Build the app
RUN npm run build

# -------------------------
# Stage 2: Serve with Nginx
# -------------------------
FROM nginx:stable

# Copy the built app from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: SPA routing
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
