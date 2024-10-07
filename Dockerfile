FROM node

RUN apt update

RUN npm install aws-sdk

WORKDIR /app

COPY src/node/main/package*.json ./

# Use npm ci for a clean install based on package-lock.json
RUN npm install

COPY ./src/node/main .

CMD ["node", "main.js"]