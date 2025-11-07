# Do not switch USER for the build stage
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
