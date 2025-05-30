# Build stage
FROM node:18 as builder
WORKDIR /app
COPY package.json next.config.mjs panda.config.ts tsconfig.json pnpm-lock.yaml ./

#Uncomment IF you are runnining from M1 chip
#RUN apt-get update && apt-get install -y pkg-config libcairo2-dev libpango1.0-dev && rm -rf /var/lib/apt/lists/*

COPY ./src/theme ./src/theme

#Get Sentry secret SENTRY_AUTH_TOKEN
ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}
ENV NEXT_PUBLIC_STATSIG_CLIENT_KEY="client-qJrMZuz9RjFLxvC5MAYbeViWqb2WLW8QewZUBk5QJrp"

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

RUN pnpm prepare

COPY . .
RUN pnpm build

RUN rm -f .npmrc

RUN cp -R node_modules prod_node_modules

# Runtime stage
FROM node:18
WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prod_node_modules ./node_modules
# Install pnpm
RUN npm install -g pnpm

EXPOSE 80
ENV NODE_ENV=production
ARG NEXTAUTH_SECRET
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ARG NEXTAUTH_URL
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ARG PORT=80
ENV PORT=${PORT}
CMD ["pnpm", "start"]