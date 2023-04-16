FROM node:16.14.0

LABEL version="1.0"
LABEL description="This is the base docker image for the RSS feed aggregator backend react app."

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

COPY workers/*.py ./workers/

RUN npm install --production

COPY . .

EXPOSE 8080

CMD ["node", "server.js"]
