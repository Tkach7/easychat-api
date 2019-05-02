import {EventTypes} from '../../types/enum';
import {Socket} from 'socket.io';

export const UserEvents = {
    getUserId: async (socket: Socket, userId: string) => {
        socket.emit(EventTypes.ServerUserId, {data: {userId}});
    }
};
