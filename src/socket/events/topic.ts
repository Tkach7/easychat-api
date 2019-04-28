import {Connection} from 'rethinkdb';
import {Topic} from '../../types/interface';
import {TOPIC_TABLE} from '../../models/topic';
import SocketIO, {Socket} from 'socket.io';
import {EventTypes} from '../../types/enum';

export const TopicEvents = {
    addTopic: (conn: Connection, socket: Socket, io: SocketIO.Server, topicName: string) => {
        const topic: Topic = {
            name: topicName,
            userOwnerId: socket.id
        };
        TOPIC_TABLE.addTopic(conn, topic)
            .then(() => TOPIC_TABLE.getTopics(conn))
            .then((topics: any) => {
                io.sockets.emit(EventTypes.ServerTopicsList, {data: topics});
            });
    }
};
