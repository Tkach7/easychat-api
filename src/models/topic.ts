import rethinkdb, {Connection} from 'rethinkdb';
import {TableNames} from '../types/enum';
import {createTable} from '../utils/dbHelper';
import {Topic} from '../types/interface';

export const TOPIC_TABLE = {
    init: (conn: Connection) => createTable(conn, TableNames.Topics),
    getTopics: (conn: Connection) =>
        new Promise((resolve, reject) => {
            rethinkdb.table(TableNames.Topics).run(conn, (error, cursor) => {
                if (error) {
                    reject(error);
                }
                cursor.toArray((err, result) => {
                    if (err) {
                        throw err;
                    }
                    resolve(JSON.stringify(result, null, 2));
                });
            });
        }),
    addTopic: (conn: Connection, topic: Topic) =>
        new Promise(async (resolve, reject) => {
            topic.id = await rethinkdb.uuid().run(conn);
            rethinkdb
                .table(TableNames.Topics)
                .insert(topic)
                .run(conn, (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(result);
                });
        })
};
