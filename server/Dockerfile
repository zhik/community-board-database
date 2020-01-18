FROM node:13.6.0-alpine
WORKDIR /server

COPY package*.json ./

RUN npm install
COPY . . 

EXPOSE 5000
ENTRYPOINT ["npm", "start"]