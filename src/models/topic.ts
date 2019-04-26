import rethinkdb, {Connection} from 'rethinkdb';
import {TableNames} from '../types/enum';
import {User} from '../types/interface';
import {createTable} from '../utils/dbHelper';

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
  addTopic: (conn: Connection, user: User) =>
    new Promise((resolve, reject) => {
      rethinkdb
        .table(TableNames.Topics)
        .insert(user)
        .run(conn, (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        });
    })
};
