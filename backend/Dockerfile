FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 8093
CMD [ "node", "index" ]