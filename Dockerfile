FROM node:16

WORKDIR /api

COPY package.json .

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 8080

CMD ["npm","run","start"]