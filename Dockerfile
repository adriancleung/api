FROM node:buster-slim

RUN if [ -z "$IS_DEV_CONTAINER" ]; then \
  # This line is to prevent the stupid openjdk-11 error
  mkdir -p /usr/share/man/man1/ && \
  apt-get update && apt-get install -y curl git nano openjdk-11-jdk-headless procps && \
  curl https://cli-assets.heroku.com/install.sh | sh; \
  fi

COPY . .

RUN npm install

CMD ["node", "app.js"]