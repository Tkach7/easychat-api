import config from 'config';
import rethinkdb, {Connection, ReqlDriverError} from 'rethinkdb';
import {UserTable} from './user';
import {TopicTable} from './topic';

export const db = {
    connect: () =>
        new Promise<Connection>((resolve, reject) => {
            rethinkdb.connect(
                {
                    host: config.get('host'),
                    port: config.get('dbPort'),
                    db: config.get('dbName'),
                    user: config.get('user'),
                    password: config.get('password')
                },
                (error: ReqlDriverError, conn: Connection) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    db.createDb(conn);
                    Promise.all([UserTable.init(conn), TopicTable.init(conn)]).then(() => resolve(conn));
                }
            );
        }),
    createDb: (conn: Connection) => {
        (rethinkdb.dbList() as any)
            .contains(config.get('dbName'))
            .do((databaseExists: any) =>
                rethinkdb.branch(
                    databaseExists,
                    {dbs_created: 0} as any,
                    rethinkdb.dbCreate(config.get('dbName')) as any
                )
            )
            .run(conn);
    }
};
