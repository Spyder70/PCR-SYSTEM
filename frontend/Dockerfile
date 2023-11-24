FROM node:14

WORKDIR /app

COPY package.json .

RUN npm install --legacy-peer-deps

RUN npm i eslint@latest --legacy-peer-deps

RUN npm i eslint-config-react-app -D --legacy-peer-deps

COPY . .

EXPOSE 3000

CMD ["npm","run","start"]