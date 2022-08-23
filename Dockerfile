FROM node:16 

RUN apt-get update -y && apt-get install -y build-essential checkinstall zlib1g-dev 

#create working directory to hold code inside the image
WORKDIR /usr/src/app

#install all app dependencies
COPY package*.json ./

RUN npm install

COPY . . 

EXPOSE 5000

CMD ["node","index.js"]