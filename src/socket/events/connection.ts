import rethinkdb, {Connection} from 'rethinkdb';
import SocketIO, {Socket} from 'socket.io';
import {USER_TABLE} from '../../models/user';
import {User} from '../../types/interface';
import {EventTypes} from '../../types/enum';
import disconnect from './disconnect';
import {TopicTable} from '../../models/topic';
import {TopicEvents} from './topic';

export default (connection: Connection, io: SocketIO.Server) => {
    return async (socket: Socket) => {
        const user: User = {
            id: await rethinkdb.uuid().run(connection),
            lastActivity: socket.handshake.time
        };
        await USER_TABLE.addUser(connection, user);

        socket.on(EventTypes.Disconnect, disconnect(connection, user));
        socket.on(EventTypes.ClientAddTopic, TopicEvents.addTopic.bind(null, connection, io, user));
        socket.on(EventTypes.ClientUserEnteredInTopic, TopicEvents.addUser.bind(null, connection, io, socket, user));
        socket.on(EventTypes.ClientUserLeftTopic, TopicEvents.removeUser.bind(null, connection, io, socket, user));

        const topics = await TopicTable.getTopics(connection);
        setTimeout(() => {
            socket.emit(EventTypes.ServerTopicsList, {data: topics});
        }, 100);
    };
};
