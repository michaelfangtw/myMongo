FROM node:20

WORKDIR /app

COPY node-mongo-test/package*.json ./
RUN npm install

COPY ./node-mongo-test .

# set permissions if needed
RUN mkdir -p logs && chown -R node:node logs
USER node

# run the node scheduler app
CMD ["node","/app/index.js"]