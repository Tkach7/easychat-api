import rethinkdb, {Connection} from 'rethinkdb';
import {TableNames} from '../types/enum';
import {createTable} from '../utils/dbHelper';
import {Topic, User} from '../types/interface';

export const TopicTable = {
    init: (conn: Connection) => createTable(conn, TableNames.Topics),
    getTopicById: (conn: Connection, topicId: string): Promise<Topic> =>
        rethinkdb
            .table(TableNames.Topics)
            .get(topicId)
            .run(conn) as Promise<Topic>,
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
    addTopic: async (conn: Connection, user: User, topicName: string): Promise<string> => {
        const id = await rethinkdb.uuid().run(conn);
        const topic: Topic = {
            id,
            name: topicName,
            userOwnerId: user.id,
            users: [{...user, activeTopicId: id}]
        };
        return rethinkdb
            .table(TableNames.Topics)
            .insert(topic)
            .run(conn)
            .then(() => id);
    },
    addUser: (conn: Connection, topicId: string, user: User) =>
        rethinkdb
            .table(TableNames.Topics)
            .get(topicId)
            .update({users: rethinkdb.row('users').append(user as any)})
            .run(conn),
    removeUser: async (conn: Connection, topicId: string, userId: string) => {
        const newTopic = (await rethinkdb
            .table(TableNames.Topics)
            .get(topicId)
            .run(conn)) as Topic;
        newTopic.users = newTopic.users.filter((u) => u.id !== userId);
        return rethinkdb
            .table(TableNames.Topics)
            .get(topicId)
            .update(newTopic)
            .run(conn);
    },
    deleteTopic: (conn: Connection, id: string) =>
        rethinkdb
            .table(TableNames.Topics)
            .get(id)
            .delete()
            .run(conn)
};
