export interface User {
    id: string;
    lastActivity: string;
    topic?: string;
}

export interface Topic {
    id?: string;
    name: string;
    userOwnerId: string;
    users: User[];
}
