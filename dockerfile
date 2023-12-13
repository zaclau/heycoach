FROM node:20
WORKDIR /home/node/app
COPY package.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run compile
EXPOSE 3000
CMD [ "npm", "start" ]