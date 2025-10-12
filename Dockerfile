FROM node:20 AS build
ARG VITE_BACKEND_URL=https://musical-memory-456j74j5qwpcqr9x-3001.app.github.dev/api/v1
WORKDIR /build
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN npm run build
FROM nginx AS final
WORKDIR /usr/share/nginx/html
COPY --from=build /build/dist .