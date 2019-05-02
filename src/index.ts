import bodyParser from 'body-parser';
import config from 'config';
import express, {NextFunction as Next, Request, Response} from 'express';
import http from 'http';
import morgan from 'morgan';
import {Connection, ReqlDriverError} from 'rethinkdb';
import SocketIO from 'socket.io';
import connection from './socket/events/connection';
import {EventTypes} from './types/enum';
import {db} from './models';

const app = express();
const server = new http.Server(app);

const socket = SocketIO as any;
const io = new socket(server);

if (config.get('debug')) {
    app.use(morgan('dev'));
}

app.use(bodyParser.urlencoded({extended: true}));

app.use((err: Error, _req: Request, _res: Response, next: Next) => {
    console.error(err.stack);
    next();
});

const port = config.get('port');

db.connect()
    .then((conn: Connection) => {
        server.listen(port, () => {
            console.info(`Server started on ${port}`);
            console.info(`Open http://localhost:${port}/`);

            io.origins(['http://localhost:5000']); // cors
            io.on(EventTypes.Connection, connection(conn, io));
        });
    })
    .catch((err: ReqlDriverError) => {
        console.warn(err);
    });
