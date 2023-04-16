FROM node:16.14.0

LABEL version="1.0"
LABEL description="This is the base docker image for the RSS feed aggregator backend react app."

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

COPY workers/*.py ./workers/

COPY requirements.txt .

RUN apt-get update && apt-get install -y python3 python3-pip

RUN pip3 install --no-cache-dir -r requirements.txt

RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
