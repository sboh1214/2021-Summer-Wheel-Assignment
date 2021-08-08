FROM node:15-alpine AS builder

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.19
COPY --from=builder /usr/src/app/dist/ /usr/share/nginx/html/
