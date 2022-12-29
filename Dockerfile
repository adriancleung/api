FROM node:18-buster-slim

RUN if [ -z "$IS_DEV_CONTAINER" ]; then \
  # This line is to prevent the stupid openjdk-11 error
  mkdir -p /usr/share/man/man1/ && \
  apt-get update && apt-get install -y curl git nano openjdk-11-jdk-headless procps && \
  curl https://cli-assets.heroku.com/install.sh | sh; \
  fi

COPY . .

RUN apt-get update && apt-get install -y build-essential python3 pkg-config libpixman-1-dev libcairo2-dev libpango1.0-dev libjpeg62-turbo-dev libgif-dev

RUN npm ci

CMD ["npm", "start"]
