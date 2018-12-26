FROM node:latest
WORKDIR /usr/app

COPY package*.json .
RUN npm install

EXPOSE 4000

COPY . .
