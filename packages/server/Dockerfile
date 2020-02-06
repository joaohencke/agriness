FROM node:12

COPY ["package.json", "babel.config.js", "yarn.lock", "lerna.json", "./"]
COPY ["packages/", "./packages"]

WORKDIR /agriness-server

COPY . .

RUN ls packages/

RUN yarn &&\
  yarn build

ENTRYPOINT [ "yarn" , "start:prod" ]