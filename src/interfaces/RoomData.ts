import { Timestamp } from 'firebase/firestore';

export interface RoomData {
    room: string;
    createdBy: string;
    createdAt: Timestamp;
}
