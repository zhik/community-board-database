FROM node:13.6.0-alpine

WORKDIR /server

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

CMD /wait && npm start