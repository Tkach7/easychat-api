export enum EventTypes {
    Connection = 'connection',
    Disconnect = 'disconnect',

    ServerTopicsList = 'server_topic_list',
    ServerUserEnteredTopic = 'server_user_entered_topic',
    ServerUserLeftTopic = 'server_user_left_topic',
    ServerUserSendMessage = 'server_user_send_message',
    ServerUpdateTopic = 'server_room_updated',

    ClientAddTopic = 'client_add_topic',
    ClientSelectedTopic = 'client_selected_topic',
    ClientUserEnteredInTopic = 'client_user_entered_in_topic',
    ClientUserLeftTopic = 'client_user_left_room',
    ClientUserSendMessage = 'client_user_send_message'
}

export enum TableNames {
    Users = 'Users',
    Topics = 'Topics'
}
