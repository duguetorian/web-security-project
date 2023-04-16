FROM node:16.14.0

LABEL version="1.0"
LABEL description="This is the base docker image for the RSS feed aggregator frontend react app."

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
