import bodyParser from 'body-parser';
import config from 'config';
import express, {NextFunction as Next, Request, Response} from 'express';
import morgan from 'morgan';
import routes from './routes';

const app = express();

if (config.get('debug')) {
  app.use(morgan('dev'));
}

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use((err: Error, _req: Request, _res: Response, next: Next) => {
  console.error(err.stack);

  next();
});

// Подключаем маршруты
routes(app);

app.use((err: Error, _req: Request, res: Response) => {
  console.error(err.stack);

  res.sendStatus(500);
});

const port = config.get('port');

app.listen(port, () => {
  console.info(`Server started on ${port}`);
  console.info(`Open http://localhost:${port}/`);
});
