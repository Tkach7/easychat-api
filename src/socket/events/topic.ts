import {Connection} from 'rethinkdb';
import {Topic, User} from '../../types/interface';
import {TopicTable} from '../../models/topic';
import SocketIO, {Socket} from 'socket.io';
import {EventTypes} from '../../types/enum';

export const TopicEvents = {
    addTopic: (conn: Connection, io: SocketIO.Server, user: User, topicName: string) => {
        const topic: Topic = {
            name: topicName,
            userOwnerId: user.id,
            users: [user]
        };
        TopicTable.addTopic(conn, topic)
            .then(() => TopicTable.getTopics(conn))
            .then((topics: any) => {
                io.sockets.emit(EventTypes.ServerTopicsList, {data: topics});
            });
    },
    addUser: (conn: Connection, io: SocketIO.Server, socket: Socket, user: User, topic: Topic) => {
        if (topic.users.find((u) => u.id === user.id)) {
            return;
        }
        socket.join(`${topic.id}`);
        TopicTable.addUser(conn, topic, user).then(() => {
            topic.users.push(user);
            io.sockets.in(`${topic.id}`).emit(EventTypes.ServerUpdateTopic, {data: topic});
        });
    },
    removeUser: (conn: Connection, io: SocketIO.Server, socket: Socket, user: User, topic: Topic) => {
        TopicTable.removeUser(conn, topic, user).then((t: any) => {
            if (t.removed) {
                TopicTable.getTopics(conn).then((topics) => {
                    socket.emit(EventTypes.ServerTopicsList, {data: topics});
                });
                return;
            }
            io.sockets.in(`${t.id}`).emit(EventTypes.ServerUpdateTopic, {data: t});
        });
    }
};
