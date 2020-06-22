# Container image that runs your code
FROM node:current-alpine

# Copies your code file from your action repository to the filesystem path `/` of the container

COPY package*.json ./
COPY lib lib
RUN npm ci --only=production

# Code file to execute when the docker container starts up (`entrypoint.sh`)
CMD ["node", "lib/graphql"]

EXPOSE 4000
