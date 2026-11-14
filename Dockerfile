# Stage 1: Build Frontend
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production Server
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

COPY package*.json ./
RUN npm ci --only=production

# Copy built frontend assets
COPY --from=builder /app/dist ./dist

# Copy backend server code and configuration
COPY server ./server
COPY public ./public

# Data folder for persistent orders and leads
RUN mkdir -p /app/data && chown -R node:node /app

USER node

EXPOSE 3001

VOLUME ["/app/data"]

CMD ["node", "server/index.js"]
