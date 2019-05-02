import {User} from '../../types/interface';
import {USER_TABLE} from '../../models/user';
import {Connection} from 'rethinkdb';

export default (connection: Connection, user: User) => async () => {
    // todo: added unsubcribe
    await USER_TABLE.removeUser(connection, user);
};
