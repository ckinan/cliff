FROM node:alpine
RUN apk --no-cache add --virtual builds-deps build-base python
WORKDIR /opt/app
COPY package*.json ./
RUN npm install
ENV PATH /opt/app/node_modules/.bin:$PATH
COPY . .
CMD [ "npm", "start" ]