FROM node

RUN apt update

WORKDIR /app

COPY package*.json ./

# Use npm ci for a clean install based on package-lock.json
RUN npm install

COPY . .

CMD ["node", "main.js"]