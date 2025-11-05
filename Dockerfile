# Stage 1: build the app
FROM node:18-alpine AS builder
LABEL stage=builder
WORKDIR /app
# copy package manifest first for caching
COPY package.json package-lock.json* ./
RUN npm ci --silent || npm install --silent
COPY . .
RUN npm run build

# Stage 2: serve with nginx
FROM nginx:stable-alpine
LABEL maintainer="you@example.com"
ARG APP_PORT=80
ENV NGINX_PORT=${APP_PORT}
COPY --from=builder /app/dist /usr/share/nginx/html
# optional: custom nginx conf could be added here
EXPOSE ${APP_PORT}
# small healthcheck (requires wget)
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:${APP_PORT}/ || exit 1

# default command runs nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
