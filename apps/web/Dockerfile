FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json ./
COPY packages ./packages
COPY apps/web/package.json apps/web/tsconfig.json apps/web/vite.config.ts apps/web/index.html ./apps/web/
RUN corepack enable && pnpm install --frozen-lockfile
COPY apps/web/src ./apps/web/src
WORKDIR /app/apps/web
EXPOSE 5173
CMD ["pnpm","dev","--","--host","0.0.0.0"]