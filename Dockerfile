FROM node:12
ENV ONLINE 1
WORKDIR /usr/src/discordbot
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD [ "npm" , "start" ]
