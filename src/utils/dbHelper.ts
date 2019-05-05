import rethinkdb, {Connection, ReqlDriverError} from 'rethinkdb';
import {TableNames} from '../types/enum';
import config = require('config');

export const createTable = (conn: Connection, tableName: TableNames) =>
    new Promise((resolve, reject) => {
        const table = rethinkdb.db(config.get('dbName')).table(tableName);
        const tableOptions = {
            primaryKey: 'id',
            durability: 'hard'
        };
        (rethinkdb.db(config.get('dbName')).tableList() as any)
            .contains(tableName)
            .do(
                rethinkdb.branch(
                    rethinkdb.row,
                    table as any,
                    (rethinkdb as any).do(() =>
                        (rethinkdb.db(config.get('dbName')).tableCreate(tableName, tableOptions) as any).do(() => table)
                    )
                )
            )
            .run(conn, (error: ReqlDriverError) => {
                if (error) {
                    reject(error);
                }
                resolve();
            });
    });
