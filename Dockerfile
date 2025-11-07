# -------------------------
# Stage 1: Build React + Vite
# -------------------------
FROM node:18-alpine AS build

WORKDIR /app

# Install build dependencies (bash and git for some Vite plugins if needed)
RUN apk add --no-cache bash git

# Copy package files first for caching
COPY package*.json ./

# Install dependencies as root
RUN npm ci

# Copy project files
COPY . .

# Build the app
RUN npm run build

# -------------------------
# Stage 2: Serve with Nginx
# -------------------------
FROM nginx:stable-alpine

# Copy build output
COPY --from=build /app/dist /usr/share/nginx/html

# Optional SPA routing (uncomment if using React Router)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
