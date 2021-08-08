FROM node:15-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

RUN apk update
RUN apk add openldap-clients

ENV SPARCS_LDAP_HOST=ldap://ldap.sparcs.org:389

RUN ldapwhoami | true
RUN ldapwhoami -H ldap://ldap.sparcs.org:389 | true

ENTRYPOINT [ "npm", "start" ]
