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
}
