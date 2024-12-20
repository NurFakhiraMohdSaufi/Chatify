import { Timestamp } from 'firebase/firestore';

export interface Message {
    id: string;
    text: string;
    room: string;
    user: string;
    createdAt: Timestamp;
    replyTo: string | null;
    image?: string | null;
}
