FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
COPY packages/db/package.json ./packages/db/package.json
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY packages/db ./packages/db
COPY apps/api ./apps/api
COPY package.json ./
RUN npx tsc -p packages/db/tsconfig.json
# packages/db points main to src/index.ts (for tsx dev); redirect to compiled output
RUN node -e "const fs=require('fs'),p=JSON.parse(fs.readFileSync('packages/db/package.json','utf8'));p.main='./dist/index.js';p.types='./dist/index.d.ts';fs.writeFileSync('packages/db/package.json',JSON.stringify(p,null,2))"
RUN npx tsc -p apps/api/tsconfig.json

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache ca-certificates
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/db/package.json ./packages/db/package.json
COPY --from=builder /app/packages/db/dist ./packages/db/dist
COPY --from=builder /app/apps/api/dist ./apps/api/dist
EXPOSE 3001
CMD ["node", "apps/api/dist/index.js"]
