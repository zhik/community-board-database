FROM node:13.0.1-alpine
WORKDIR /client

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
CMD npm run dev