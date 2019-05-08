# В качестве базового образа используем образ с Node.js 10
FROM node:10
LABEL maintainer="Daniil Tkach <dan7tkach@gmail.com>"

# Копируем файлы необходимые для работы приложения
COPY config /config
COPY dist /dist
COPY package.json /
COPY package-lock.json /

# Устанавливаем зависимости
RUN npm run deps:production

# Указываем production окружение для приложения
# Благодаря ему мы применим конфигурацию из configs/production.ts
ENV NODE_ENV production

# Сообщаем, что контейнер готов принимать запросы по 80 порту
# Нужно для локального запуска контейнера, Heroku проигнорирует
ENV PORT 3000
EXPOSE 3000

# Запускаем сервис при старте контейнера
CMD npm start
