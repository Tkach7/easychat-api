import rethinkdb, {Connection} from 'rethinkdb';
import {TableNames} from '../types/enum';
import {User} from '../types/interface';
import {createTable} from '../utils/dbHelper';

export const USER_TABLE = {
    init: (conn: Connection) => createTable(conn, TableNames.Users),
    addUser: (conn: Connection, user: User) =>
        rethinkdb
            .table(TableNames.Users)
            .insert(user)
            .run(conn),
    removeUser: (conn: Connection, user: User) =>
        rethinkdb
            .table(TableNames.Users)
            .get(user.id)
            .delete()
            .run(conn)
};
