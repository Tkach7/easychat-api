# Easychat-api
https://easychatme.herokuapp.com/

В основе [Express.js](https://expressjs.com/) и [Handelbars](http://handlebarsjs.com/). Статика приложения размещается в [Surge CDN](https://surge.sh/), а само приложение в облаке [Heroku](https://www.heroku.com/). Автоматизация настроена в [Circle CI](https://circleci.com/).

### Разработка

Устанавливаем зависимости:
```sh
npm run deps:all
```

Компилируем TypeScript в директорию `dist`:
```sh
npm run build
```

Запускаем сервис локально:
```sh
npm start
```

И открываем в браузере:  
http://localhost:3000/

### Развёртывание

Авторизуемся в Heroku и создаём приложение:
```sh
npm run heroku-init
```

Компилируем TypeScript в директорию `dist`:
```sh
npm run build
```

Размещаем статику в Surge CDN (в первый раз вводим почту и пароль):
```sh
npm run surge
```

Далее размещаем приложение:
```sh
npm run heroku
```

### Доступные команды

| Команда | Действие |
| ------------- | ------------- |
| clean | Удаление зависимостей и собранных файлов |
| build | Сборка приложения |
| build:ts | Компилиция TypeScript исходников |
| ci:heroku:build | Сборка Docker-образа в Circle CI |
| ci:heroku:login | Авторизация в Heroku из Circle CI |
| ci:heroku:push | Отправка образа в Heroku из Circle CI |
| ci:heroku:release | Запуск контейнера с приложением в Heroku из Circle CI |
| deps:all | Установка всех зависимостей |
| deps:production | Установка зависимостей, ноебходимых только для работы приложения |
| docker:build | Локальная сборка Docker-образа |
| docker:run | Локальный запуск контейнера с приложением |
| heroku:login | Авторизация в Heroku |
| heroku:push | Сборка и отправка образа в Heroku |
| heroku:release | Запуск контейнера с приложением в Heroku |
| heroku:open | Открыть браузер с приложение в Heroku |
| heroku | Деплой приложения в Heroku |
| lint | Запуск всех проверок |
| lint:deps | Проверка зависимостей |
| lint:es | Проверка TypeScript файлов |
| lint:ts | Проверка TypeScript файлов |
| start | Старт приложения |
