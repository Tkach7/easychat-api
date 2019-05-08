import {Connection} from 'rethinkdb';
import {Topic} from '../../types/interface';
import {TopicTable} from '../../models/topic';
import SocketIO, {Socket} from 'socket.io';
import {EventTypes} from '../../types/enum';
import {UserTable} from '../../models/user';

export const TopicEvents = {
    getTopics: async (conn: Connection, socket: Socket) => {
        const topics = await TopicTable.getTopics(conn);
        socket.emit(EventTypes.ServerTopicsList, {data: topics});
    },
    addTopic: async (conn: Connection, io: SocketIO.Server, userId: string, topicName: string) => {
        const id = await TopicTable.addTopic(conn, userId, topicName);
        await UserTable.updateActiveTopic(conn, userId, id);
        const topics = (await TopicTable.getTopics(conn)) as Topic[];
        io.sockets.emit(EventTypes.ServerTopicsList, {data: topics});
    },
    addMsg: async (conn: Connection, io: SocketIO.Server, userId: string, {topicId, text}) => {
        await TopicTable.addMsg(conn, topicId, userId, text);
        const topic = await TopicTable.getTopicById(conn, topicId);
        io.sockets.in(`${topic.id}`).emit(EventTypes.ServerUpdateTopic, {data: topic});
    },
    addUser: async (conn: Connection, io: SocketIO.Server, socket: Socket, userId: string, topicId: string) => {
        socket.join(topicId);
        await TopicTable.addUser(conn, topicId, userId);
        await UserTable.updateActiveTopic(conn, userId, topicId);
        const topic = await TopicTable.getTopicById(conn, topicId);
        io.sockets.in(`${topic.id}`).emit(EventTypes.ServerUpdateTopic, {data: topic});
    },
    userLeftTopic: async (conn: Connection, io: SocketIO.Server, socket: Socket, userId: string, topicId: string) => {
        const topic = await TopicTable.getTopicById(conn, topicId);
        await UserTable.updateActiveTopic(conn, userId, null);
        if (topic.usersId.length === 1) {
            setTimeout(async () => {
                const newTopic = await TopicTable.getTopicById(conn, topicId);
                if (newTopic.usersId.length === 1) {
                    await TopicTable.deleteTopic(conn, topicId);
                    const topics = await TopicTable.getTopics(conn);
                    socket.emit(EventTypes.ServerTopicsList, {data: topics});
                }
            }, 30000);
        }
        await TopicTable.removeUser(conn, topicId, userId);
        io.sockets.in(topicId).emit(EventTypes.ServerUpdateTopic, {
            data: {...topic, usersId: topic.usersId.filter((id) => id !== userId)}
        });
    }
};
