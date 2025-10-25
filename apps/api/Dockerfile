FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json ./
COPY packages ./packages
COPY apps/api/package.json apps/api/tsconfig.json ./apps/api/
COPY data ./data
RUN corepack enable && pnpm install --frozen-lockfile
COPY apps/api/src ./apps/api/src
WORKDIR /app/apps/api
EXPOSE 4000
CMD ["pnpm","dev"]