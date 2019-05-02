import rethinkdb, {Connection} from 'rethinkdb';
import {EventTypes, TableNames} from '../types/enum';
import {User} from '../types/interface';
import {createTable} from '../utils/dbHelper';
import {Socket} from 'socket.io';

export const UserTable = {
    init: (conn: Connection) => createTable(conn, TableNames.Users),
    getUserById: (conn, userId): Promise<User> =>
        rethinkdb
            .table(TableNames.Users)
            .get(userId)
            .run(conn) as Promise<User>,
    updateActiveTopic: (conn: Connection, userId: string, activeTopicId) =>
        rethinkdb
            .table(TableNames.Users)
            .get(userId)
            .update({['activeTopicId']: activeTopicId})
            .run(conn),
    addUser: async (conn: Connection, user: User, socket: Socket) =>
        rethinkdb
            .table(TableNames.Users)
            .insert(user)
            .run(conn)
            .then(() => socket.emit(EventTypes.ServerUserId, user.id)),
    removeUser: (conn: Connection, userId: string) =>
        rethinkdb
            .table(TableNames.Users)
            .get(userId)
            .delete()
            .run(conn)
};
