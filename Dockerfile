FROM node:buster-slim

RUN if [ -z "$IS_DEV_CONTAINER" ]; then \
  # This line is to prevent the stupid openjdk-11 error
  mkdir -p /usr/share/man/man1/ && \
  apt-get update && apt-get install -y git openjdk-11-jdk-headless; \
  fi

COPY . .

RUN npm install

CMD ["node", "app.js"]