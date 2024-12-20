import { Message } from './Message';

export interface ChatData {
    [roomName: string]: Message[];
}
