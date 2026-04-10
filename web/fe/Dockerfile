FROM node:24.11.0-alpine AS build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.29.3

COPY --from=build-stage /app/dist/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
