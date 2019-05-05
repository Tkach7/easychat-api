import rethinkdb, {Connection} from 'rethinkdb';
import {TableNames} from '../types/enum';
import {createTable} from '../utils/dbHelper';
import {Message, Topic} from '../types/interface';

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
    addTopic: async (conn: Connection, userId: string, topicName: string): Promise<string> => {
        const id = await rethinkdb.uuid().run(conn);
        const topic: Topic = {
            id,
            name: topicName,
            userOwnerId: userId,
            usersId: [userId],
            messages: []
        };
        return rethinkdb
            .table(TableNames.Topics)
            .insert(topic)
            .run(conn)
            .then(() => id);
    },
    addUser: async (conn: Connection, topicId: string, userId: string) => {
        const topic = await TopicTable.getTopicById(conn, topicId);
        if (topic.usersId.includes(userId)) {
            return;
        }
        rethinkdb
            .table(TableNames.Topics)
            .get(topicId)
            .update({usersId: rethinkdb.row('usersId').append(userId)})
            .run(conn);
    },
    removeUser: async (conn: Connection, topicId: string, userId: string) => {
        const newTopic = (await rethinkdb
            .table(TableNames.Topics)
            .get(topicId)
            .run(conn)) as Topic;
        newTopic.usersId = newTopic.usersId.filter((id) => id !== userId);
        return rethinkdb
            .table(TableNames.Topics)
            .get(topicId)
            .update(newTopic)
            .run(conn);
    },
    addMsg: async (conn: Connection, topicId: string, userId: string, text: string) => {
        const id = await rethinkdb.uuid().run(conn);
        const message: Message = {text, topicId, userId, id, createdAt: `${new Date()}`};
        await rethinkdb
            .table(TableNames.Topics)
            .get(topicId)
            .update({messages: rethinkdb.row('messages').append(message as any)})
            .run(conn);
    },

    deleteTopic: (conn: Connection, id: string) =>
        rethinkdb
            .table(TableNames.Topics)
            .get(id)
            .delete()
            .run(conn)
};
