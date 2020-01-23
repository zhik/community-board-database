# Setup and build the client
FROM node:13.6.0-alpine as client
WORKDIR /client

COPY client/package*.json ./

RUN npm install -qy
COPY client/ ./
RUN npm run build


# Setup server
FROM node:13.6.0-alpine

WORKDIR /app
COPY --from=client /client/public ./public

COPY server/package*.json ./
RUN npm install -qy

COPY server/ ./

EXPOSE 5000

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

CMD /wait && npm start