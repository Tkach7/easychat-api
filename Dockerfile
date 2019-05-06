FROM node:10
LABEL maintainer="Daniil Tkach <dan7tkach@gmail.com>"
WORKDIR /easychat-api
COPY package*.json ./
RUN npm run deps:production
COPY . ./
ENV NODE_ENV production
RUN npm run build
ENV PORT 3000
EXPOSE 3000
