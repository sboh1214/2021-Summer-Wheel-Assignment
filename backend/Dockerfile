FROM node:15-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

RUN apk update
RUN apk add openldap-clients

ENTRYPOINT [ "npm", "start"]
