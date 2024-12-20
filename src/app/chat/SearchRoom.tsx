import 'font-awesome/css/font-awesome.min.css';
import '@/styles/Room.css';

import {
	addDoc,
	collection,
	getDocs,
	query,
	Timestamp,
	where,
} from 'firebase/firestore';
import React, { JSX, useEffect, useState } from 'react';

import { auth, db } from '@/config/firebase-config';
import { RoomData } from '@/interfaces/RoomData';

import { CreateGroup } from './CreateGroup';

export interface SearchRoomProps {
    setRoom: (roomName: string) => void;
    setIsInChat: (isInChat: boolean) => void;
}

export default function SearchRoom({
    setRoom,
    setIsInChat,
}: SearchRoomProps): JSX.Element {
    const [roomName, setRoomName] = useState('');
    const [rooms, setRooms] = useState<RoomData[]>([]);

    useEffect(() => {
        const searchRooms = async () => {
            if (roomName.trim() === '') {
                setRooms([]);
                return;
            }

            const q = query(
                collection(db, 'room'),
                where('room', '>=', roomName),
                where('room', '<=', roomName + '\uf8ff'),
            );

            const querySnapshot = await getDocs(q);
            const roomList: RoomData[] = querySnapshot.docs.map(
                (doc) => doc.data() as RoomData,
            );
            setRooms(roomList);
        };

        searchRooms();
    }, [roomName]);

    async function joinRoom(roomId: string) {
        try {
            const user = auth.currentUser?.displayName;

            if (!user) return;

            const q = query(
                collection(db, 'userRooms'),
                where('userId', '==', user),
                where('roomId', '==', roomId),
            );

            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                console.log('User is already in the room');
                return;
            }

            await addDoc(collection(db, 'userRooms'), {
                userId: user,
                roomId,
                joinedAt: Timestamp.fromDate(new Date()),
                lastRead: null,
            });

            console.log('User added to the room:', roomId);
        } catch (e) {
            console.log('Error joining room', e);
        }
    }

    const handleEnterChat = (room: string) => {
        joinRoom(room);
        setRoom(room);
        setIsInChat(true);

        setRooms([]);
        setRoomName('');
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRoomName(e.target.value);
    };

    return (
        <div className='flex flex-col'>
            <div className='flex flex-row items-center justify-between text-xs text-black'>
                <span className='font-bold text-white text-sm'>Search</span>
            </div>
            <div className='flex flex-row justify-between items-center mt-2 mb-2'>
                <div className='relative flex-grow'>
                    <input
                        type='text'
                        onChange={handleSearchChange}
                        className='px-4 py-2 w-full text-black bg-white border-b border-whatsapp rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-whatsapp'
                        placeholder='Search'
                    />
                    <i className='fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5'></i>
                </div>

                <div className='ml-4'>
                    <CreateGroup setIsInChat={setIsInChat} />
                </div>
            </div>

            {rooms.length > 0 && (
                <div className='mt-2'>
                    <ul className='space-y-2'>
                        {rooms.map((room, index) => (
                            <li
                                key={index}
                                onClick={() => handleEnterChat(room.room)}
                                className='cursor-pointer p-2 bg-gray-500 hover:bg-whatsapp rounded-md'
                            >
                                {room.room}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
