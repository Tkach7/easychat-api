import config from 'config';
import rethinkdb, {Connection, ReqlDriverError} from 'rethinkdb';
import {USER_TABLE} from './user';
import {TopicTable} from './topic';

export const db = {
    connect: () =>
        new Promise<Connection>((resolve, reject) => {
            rethinkdb.connect(
                {host: config.get('host'), port: config.get('db_port'), db: config.get('db_name')},
                (error: ReqlDriverError, conn: Connection) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    db.createDb(conn);
                    Promise.all([USER_TABLE.init(conn), TopicTable.init(conn)]).then(() => resolve(conn));
                }
            );
        }),
    createDb: (conn: Connection) => {
        (rethinkdb.dbList() as any)
            .contains(config.get('db_name'))
            .do((databaseExists: any) =>
                rethinkdb.branch(
                    databaseExists,
                    {dbs_created: 0} as any,
                    rethinkdb.dbCreate(config.get('db_name')) as any
                )
            )
            .run(conn);
    }
};
