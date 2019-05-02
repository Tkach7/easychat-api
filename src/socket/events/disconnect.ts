import {Topic} from '../../types/interface';
import {UserTable} from '../../models/user';
import {Connection} from 'rethinkdb';
import {TopicEvents} from './topic';
import SocketIO, {Socket} from 'socket.io';
import {TopicTable} from '../../models/topic';

export default (connection: Connection, io: SocketIO.Server, socket: Socket, userId: string) => async () => {
    const topics = (await TopicTable.getTopics(connection)) as Topic[];
    const topic = topics.find((t) => t.usersId.some((id) => id === userId));
    if (topic) {
        await TopicEvents.userLeftTopic(connection, io, socket, userId, topic.id);
    }
    await UserTable.removeUser(connection, userId);
};
