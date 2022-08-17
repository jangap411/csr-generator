FROM node:latest AS builder

WORKDIR /app 

COPY frontend/package.json .
COPY frontend/package-lock.json . 

COPY frontend .

RUN npm run build 


FROM 

