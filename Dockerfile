FROM node:11-alpine

# avoid using root user
RUN mkdir -p /home/node/app/node_modules && \
    chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

# switch to node user
USER node

# Install dependencies
RUN npm install

# Bundle app source with approp permission
COPY --chown=node:node . .

EXPOSE 3000

CMD ["npm", "start"]