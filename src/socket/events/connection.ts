import {Connection} from 'rethinkdb';
import SocketIO, {Socket} from 'socket.io';
import {USER_TABLE} from '../../models/user';
import {User} from '../../types/interface';
import {EventTypes} from '../../types/enum';
import disconnect from './disconnect';
import {TOPIC_TABLE} from '../../models/topic';
import {TopicEvents} from './topic';

export default (connection: Connection, io: SocketIO.Server) => {
    return async (socket: Socket) => {
        const user: User = {
            id: socket.id,
            lastActivity: socket.handshake.time
        };
        await USER_TABLE.addUser(connection, user);

        socket.on(EventTypes.Disconnect, disconnect(connection, user));
        socket.on(EventTypes.ClientAddTopic, TopicEvents.addTopic.bind(null, connection, socket, io));

        const topics = await TOPIC_TABLE.getTopics(connection);

        socket.emit(EventTypes.ServerTopicsList, {data: topics});
    };
};
