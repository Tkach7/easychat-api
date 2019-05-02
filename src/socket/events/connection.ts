import rethinkdb, {Connection} from 'rethinkdb';
import SocketIO, {Socket} from 'socket.io';
import {UserTable} from '../../models/user';
import {User} from '../../types/interface';
import {EventTypes} from '../../types/enum';
import disconnect from './disconnect';
import {TopicEvents} from './topic';
import {UserEvents} from './user';

export default (connection: Connection, io: SocketIO.Server) => {
    return async (socket: Socket) => {
        const user: User = {
            id: await rethinkdb.uuid().run(connection),
            lastActivity: socket.handshake.time
        };
        await UserTable.addUser(connection, user, socket);
        socket.on(EventTypes.ClientGetUserId, UserEvents.getUserId.bind(null, socket, user.id));
        socket.on(EventTypes.ClientAddTopic, TopicEvents.addTopic.bind(null, connection, io, user.id));
        socket.on(EventTypes.ClientGetTopics, TopicEvents.getTopics.bind(null, connection, socket));
        socket.on(EventTypes.ClientUserEnteredInTopic, TopicEvents.addUser.bind(null, connection, io, socket, user.id));
        socket.on(
            EventTypes.ClientUserLeftTopic,
            TopicEvents.userLeftTopic.bind(null, connection, io, socket, user.id)
        );
        socket.on(EventTypes.Disconnect, disconnect(connection, io, socket, user.id));
    };
};
