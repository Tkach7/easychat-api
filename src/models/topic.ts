import rethinkdb, {Connection} from 'rethinkdb';
import {TableNames} from '../types/enum';
import {createTable} from '../utils/dbHelper';
import {Topic, User} from '../types/interface';

export const TopicTable = {
    init: (conn: Connection) => createTable(conn, TableNames.Topics),
    getTopics: (conn: Connection) =>
        new Promise((resolve, reject) => {
            rethinkdb.table(TableNames.Topics).run(conn, (error, cursor) => {
                if (error) {
                    reject(error);
                }
                cursor.toArray((err, result: Topic[]) => {
                    if (err) {
                        throw err;
                    }
                    resolve(result);
                });
            });
        }),
    addTopic: async (conn: Connection, topic: Topic) => {
        topic.id = await rethinkdb.uuid().run(conn);
        return rethinkdb
            .table(TableNames.Topics)
            .insert(topic)
            .run(conn);
    },
    addUser: (
        conn: Connection,
        topic: Topic,
        user: any // todo: type
    ) =>
        rethinkdb
            .table(TableNames.Topics)
            .get(`${topic.id}`)
            .update({users: rethinkdb.row('users').append(user)})
            .run(conn),
    removeUser: async (conn: Connection, topic: Topic, user: User) => {
        const newTopic = (await rethinkdb
            .table(TableNames.Topics)
            .get(`${topic.id}`)
            .run(conn)) as Topic;
        newTopic.users = newTopic.users.filter((u) => u.id !== user.id);
        if (!newTopic.users.length) {
            return TopicTable.deleteTopic(conn, topic.id);
        }
        return rethinkdb
            .table(TableNames.Topics)
            .get(`${topic.id}`)
            .update(newTopic, {returnChanges: true})
            .run(conn);
    },
    deleteTopic: (conn: Connection, id: string) =>
        rethinkdb
            .table(TableNames.Topics)
            .get(id)
            .delete()
            .run(conn)
            .then(() => ({removed: true}))
};
