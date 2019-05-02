export interface User {
    id: string;
    lastActivity: string;
    topic?: string;
    activeTopicId?: string;
}

export interface Topic {
    id?: string;
    name: string;
    userOwnerId: string;
    usersId: string[];
    messages: Message[];
}

export interface Message {
    id: string;
    topicId: string;
    text: string;
    userId: string;
    createdAt: string;
}
