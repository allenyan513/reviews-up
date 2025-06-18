## 1. Builder stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

## 2. Production stage
FROM node:22-alpine AS production
WORKDIR /app
COPY --from=builder /app/apps/web/.next /app/apps/web/.next
COPY --from=builder /app/apps/web/public /app/apps/web/public
COPY --from=builder /app/apps/web/package.json /app/apps/web/package.json

COPY --from=builder /app/apps/api/dist /app/apps/api/dist
COPY --from=builder /app/apps/api/package.json /app/apps/api/package.json

COPY --from=builder /app/apps/landing/.next /app/apps/landing/.next
COPY --from=builder /app/apps/landing/public /app/apps/landing/public
COPY --from=builder /app/apps/landing/package.json /app/apps/landing/package.json

COPY --from=builder /app/packages /app/packages

RUN npm install --production

EXPOSE 5510
EXPOSE 5520
EXPOSE 5550

CMD ["npm", "run", "start"]

