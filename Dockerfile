FROM node:8.11.3-alpine
RUN mkdir /app
WORKDIR /app
ADD . /app
RUN npm install
CMD npm run front && npm run dev
