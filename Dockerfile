FROM node:16 

#create working directory to hold code inside the image
WORKDIR /usr/src/app

#install all app dependencies
COPY package*.json ./

RUN npm install

COPY . . 

EXPOSE 5000

CMD ["node","index.js"]