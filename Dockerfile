FROM node:4-slim

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install --production
COPY . /usr/src/app

ENV PORT 80

CMD [ "node", "index.js" ]
