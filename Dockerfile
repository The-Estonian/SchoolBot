FROM node:18

RUN apt update && apt install -y --no-install-recommends \
    && npm cache clean --force

WORKDIR /app

COPY src/node/main/package*.json ./

RUN npm install

COPY ./src/node/main .

CMD ["node", "main.js"]