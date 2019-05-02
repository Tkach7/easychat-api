import {Topic, User} from '../../types/interface';
import {UserTable} from '../../models/user';
import {Connection} from 'rethinkdb';
import {TopicEvents} from './topic';
import SocketIO, {Socket} from 'socket.io';
import {TopicTable} from '../../models/topic';

export default (connection: Connection, io: SocketIO.Server, socket: Socket, user: User) => async () => {
    const topics = (await TopicTable.getTopics(connection)) as Topic[];
    const topic = topics.find((t) => t.users.some((u) => u.id === user.id));
    if (topic) {
        await TopicEvents.userLeftTopic(connection, io, socket, user.id, topic.id);
    }
    await UserTable.removeUser(connection, user);
};
