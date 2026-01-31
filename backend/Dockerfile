# Build stage
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy prisma schema and source (generated output goes into src/generated)
COPY prisma ./prisma/
COPY src ./src
RUN npx prisma generate

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy package files (include Prisma CLI for migrations)
COPY package.json package-lock.json ./
RUN npm ci

# Copy prisma, generated client, and full src from base
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/src ./src
COPY --from=base /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=base /app/node_modules/@prisma ./node_modules/@prisma

# Regenerate Prisma client for Linux in this image
RUN npx prisma generate

EXPOSE 8080

# Run migrations then start server
CMD ["sh", "-c", "npx prisma migrate deploy && node src/index.js"]
