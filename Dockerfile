# -------------------------
# Stage 1: Build React + Vite
# -------------------------
FROM node:18-slim AS build

# Use a non-root user to avoid permission issues
WORKDIR /app
RUN chown -R node:node /app
USER node

# Copy package files first (better for caching)
COPY --chown=node:node package.json package-lock.json ./

# Copy the rest of the project
COPY --chown=node:node . .

# Install dependencies
RUN npm ci

# Add local binaries to PATH
ENV PATH=/app/node_modules/.bin:$PATH

# Copy the rest of the project
COPY --chown=node:node . .

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
