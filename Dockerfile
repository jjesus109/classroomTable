# FROM node:12-slim
# WORKDIR /usr/src/app
# COPY package*.json ./
# RUN npm install -g @angular/cli
# RUN npm install
# COPY . ./
# RUN npm run build
# EXPOSE 8080
# CMD [ "node", "server.js" ]


### STAGE 1: Build ###
# # We label our stage as ‘builder’
# FROM node:12-slim as builder
# COPY package.json package-lock.json ./
# ## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
# RUN npm ci && mkdir /ng-app && mv ./node_modules ./ng-app
# WORKDIR /ng-app
# RUN yarn remove lock
# RUN yarn add lock
# COPY . .
# RUN npm i bulma
# RUN npm i bulma-carousel
# ## Build the angular app in production mode and store the artifacts in dist folder
# RUN npm run build 
### STAGE 2: Setup ###
FROM nginx
## Copy our default nginx config
COPY default.conf /etc/nginx/conf.d/
## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*
## From ‘builder’ stage copy over the artifacts in dist folder to default nginx public folder
COPY . /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]