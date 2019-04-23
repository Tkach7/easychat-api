import {Application} from 'express';

export = (app: Application) => {
    app.get('/favicon.ico', (_, res) => res.status(204));

    app.get('/', (_, res) => {
        res.send('App works!');
    });

    // app.all('*', error404);
};
