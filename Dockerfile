FROM node:14.13-stretch

WORKDIR /opt/project

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install --only=production


# Bundle app source
COPY ./app ./app

EXPOSE 3000
CMD [ "node", "app/index.js" ]
