import {Connection} from 'rethinkdb';
import {Topic, User} from '../../types/interface';
import {TopicTable} from '../../models/topic';
import SocketIO, {Socket} from 'socket.io';
import {EventTypes} from '../../types/enum';
import {UserTable} from '../../models/user';

export const TopicEvents = {
    getTopics: async (conn: Connection, socket: Socket) => {
        const topics = await TopicTable.getTopics(conn);
        socket.emit(EventTypes.ServerTopicsList, {data: topics});
    },
    addTopic: async (conn: Connection, io: SocketIO.Server, user: User, topicName: string) => {
        const id = await TopicTable.addTopic(conn, user, topicName);
        await UserTable.updateActiveTopic(conn, user.id, id);
        const topics = (await TopicTable.getTopics(conn)) as Topic[];
        io.sockets.emit(EventTypes.ServerTopicsList, {data: topics});
    },
    addUser: async (conn: Connection, io: SocketIO.Server, socket: Socket, user: User, topicId: string) => {
        socket.join(topicId);
        await TopicTable.addUser(conn, topicId, {...user, activeTopicId: topicId});
        await UserTable.updateActiveTopic(conn, user.id, topicId);
        const topic = await TopicTable.getTopicById(conn, topicId);
        io.sockets.in(`${topic.id}`).emit(EventTypes.ServerUpdateTopic, {data: topic});
    },
    userLeftTopic: async (conn: Connection, io: SocketIO.Server, socket: Socket, userId: string, topicId: string) => {
        const topic = await TopicTable.getTopicById(conn, topicId);
        await UserTable.updateActiveTopic(conn, userId, null);
        if (topic.users.length === 1) {
            await TopicTable.deleteTopic(conn, topicId);
            const topics = await TopicTable.getTopics(conn);
            socket.emit(EventTypes.ServerTopicsList, {data: topics});
            return;
        }
        await TopicTable.removeUser(conn, topicId, userId);
        io.sockets
            .in(topicId)
            .emit(EventTypes.ServerUpdateTopic, {data: {...topic, users: topic.users.filter((u) => u.id !== userId)}});
    }
};
