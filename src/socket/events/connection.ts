import {Connection} from 'rethinkdb';
import {Socket} from 'socket.io';
import {USER_TABLE} from '../../models/user';
import {User} from '../../types/interface';
import {EventTypes} from '../../types/enum';
import disconnect from './disconnect';
import {TOPIC_TABLE} from '../../models/topic';

export default (connection: Connection) => {
  return async (socket: Socket) => {
    const user: User = {
      id: socket.id,
      lastActivity: socket.handshake.time
    };
    await USER_TABLE.addUser(connection, user);

    socket.on('disconnect', disconnect(connection, user));

    const topics = await TOPIC_TABLE.getTopics(connection);

    socket.emit(EventTypes.ServerTopicsList, {data: topics});
  };
};
