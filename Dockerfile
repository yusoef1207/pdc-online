FROM node:8.11.3-alpine
RUN mkdir /app
WORKDIR /app
ADD package.json /tmp/package.json
RUN cd /tmp && npm install 

ADD . /app

RUN cp /app/.env.develop /app/.env

RUN cp -a /tmp/node_modules /app
RUN npm run build
CMD ["sh"]
