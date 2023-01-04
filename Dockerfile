FROM node:alpine
WORKDIR ./
COPY package.json ./
COPY package-lock.json ./
COPY .env ./
COPY ./ ./
RUN npm i
CMD ["npm", "start"]
