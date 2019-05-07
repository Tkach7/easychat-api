'use strict';

module.exports = {
    dbName: 'easychat',
    dbPort: process.env.DB_PORT,
    debug: false,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.PORT,
    user: process.env.DB_USER
};
