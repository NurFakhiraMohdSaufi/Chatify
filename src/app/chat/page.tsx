'use client';

import '@/styles/ListChat.css';

import {
	collection,
	doc,
	getDocs,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	setDoc,
	updateDoc,
	where,
} from 'firebase/firestore';
import { Circle } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { auth, db } from '@/config/firebase-config';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

interface ListRoomProps {
    setRoom: (roomName: string) => void;
    setIsInChat: (isInChat: boolean) => void;
}

interface Message {
    id: string;
    text: string;
    room: string;
    user: string;
    createdAt: number;
}

const ListChat: React.FC<ListChatProps> = ({setRoom, setIsInChat}) => {
    const [rooms, setRooms] = useState<
        {roomName: string; roomPhotoURL: string}[]
    >([]);
    const [message, setMessage] = useState<
        {roomName: string; messages: Message[]}[]
    >([]);
    const [notifications, setNotifications] = useState<
        {roomName: string; hasNewMessage: boolean; newMessageCount: number}[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [noRooms, setNoRooms] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
    const user = auth.currentUser?.displayName;

    useEffect(() => {
        if (user) {
            const chatRef = collection(db, 'userRooms');
            const queryChat = query(chatRef, where('userId', '==', user));

            const unsubscribeRooms = onSnapshot(queryChat, async (snapshot) => {
                const roomsList: {roomName: string; roomPhotoURL: string}[] =
                    [];
                if (snapshot.empty) {
                    setNoRooms(true);
                } else {
                    setNoRooms(false);
                }

                for (const docSnap of snapshot.docs) {
                    const data = docSnap.data();
                    const roomName = data.roomId;

                    const roomRef = query(
                        collection(db, 'room'),
                        where('room', '==', roomName),
                    );
                    const roomQuerySnapshot = await getDocs(roomRef);

                    roomQuerySnapshot.forEach((roomDoc) => {
                        const roomData = roomDoc.data();
                        const roomPhotoURL = roomData?.roomPhotoURL || '';
                        if (!roomsList.some((r) => r.roomName === roomName)) {
                            roomsList.push({roomName, roomPhotoURL});
                        }
                    });
                }

                setRooms(roomsList);
                setLoading(false);
            });

            return () => unsubscribeRooms();
        }
    }, [user]);

    useEffect(() => {
        if (rooms.length > 0) {
            const unsubscribeMessages = rooms.map((room) => {
                const chatRef = collection(db, 'messages');
                const queryMessages = query(
                    chatRef,
                    where('room', '==', room.roomName),
                    orderBy('createdAt'),
                );

                return onSnapshot(queryMessages, async (snapshot) => {
                    const messagesForRoom: Message[] = [];
                    let hasNewMessage = false;

                    const userRoomQuery = query(
                        collection(db, 'userRooms'),
                        where('userId', '==', user),
                        where('roomId', '==', room.roomName),
                    );
                    const querySnapshot = await getDocs(userRoomQuery);

                    let lastRead = 0;
                    if (!querySnapshot.empty) {
                        querySnapshot.forEach((doc) => {
                            const data = doc.data();
                            lastRead = data?.lastRead || 0;
                        });
                    }

                    let newMessageCount = 0;

                    snapshot.forEach((doc) => {
                        const data = doc.data();
                        const message: Message = {
                            id: doc.id,
                            text: data.text || '',
                            room: room.roomName,
                            user: data.user || '',
                            createdAt: data.createdAt,
                        };

                        if (data.createdAt > lastRead && data.user !== user) {
                            hasNewMessage = true;
                            newMessageCount++;
                        }

                        messagesForRoom.push(message);
                    });

                    setMessage((prevMessages) => {
                        const updatedMessages = prevMessages.filter(
                            (msg) => msg.roomName !== room.roomName,
                        );
                        updatedMessages.push({
                            roomName: room.roomName,
                            messages: messagesForRoom,
                        });
                        return updatedMessages;
                    });

                    setNotifications((prevNotifications) => {
                        const updatedNotifications = prevNotifications.filter(
                            (notif) => notif.roomName !== room.roomName,
                        );
                        updatedNotifications.push({
                            roomName: room.roomName,
                            hasNewMessage,
                            newMessageCount,
                        });
                        return updatedNotifications;
                    });
                });
            });

            return () =>
                unsubscribeMessages.forEach((unsubscribe) => unsubscribe());
        }
    }, [rooms, user]);

    const handleRoomClick = async (roomName: string) => {
        setRoom(roomName);
        setIsInChat(true);
        setSelectedRoom(roomName);

        setNotifications((prevNotifications) =>
            prevNotifications.map((notif) =>
                notif.roomName === roomName
                    ? {...notif, hasNewMessage: false}
                    : notif,
            ),
        );

        try {
            const userRoomQuery = query(
                collection(db, 'userRooms'),
                where('userId', '==', user),
                where('roomId', '==', roomName),
            );

            const querySnapshot = await getDocs(userRoomQuery);

            if (!querySnapshot.empty) {
                querySnapshot.forEach(async (doc) => {
                    await updateDoc(doc.ref, {lastRead: serverTimestamp()});
                });
            } else {
                const userRoomRef = doc(
                    collection(db, 'userRooms'),
                    `${user}_${roomName}`,
                );
                await setDoc(userRoomRef, {
                    lastRead: Date.now(),
                    userId: user,
                    roomId: roomName,
                });
            }
        } catch (error) {
            console.error('Error updating userRooms:', error);
        }
    };

    return (
        <div className='list-container'>
            <div>
                <span className='header-convo'>Conversations</span>
            </div>
            <div className='card-list'>
                {loading ? (
                    <Box sx={{display: 'flex', justifyContent: 'center'}}>
                        <CircularProgress size='30px' />
                    </Box>
                ) : noRooms ? (
                    <div className='text-white'>
                        No recent chat rooms found.
                    </div>
                ) : (
                    rooms.map((room, index) => (
                        <button
                            key={index}
                            className={`button-chat ${
                                selectedRoom === room.roomName
                                    ? 'bg-whatsapp'
                                    : ''
                            }`}
                            onClick={() => handleRoomClick(room.roomName)}
                            aria-label={`Chat with ${room.roomName}`}
                        >
                            <div className='flex'>
                                <Image
                                    className='flex items-center justify-center h-8 w-8 bg-indigo-200 ml-1 rounded-full'
                                    src={
                                        room.roomPhotoURL ||
                                        'https://static.vecteezy.com/system/resources/previews/026/019/617/original/group-profile-avatar-icon-default-social-media-forum-profile-photo-vector.jpg'
                                    }
                                    width={200}
                                    height={200}
                                    alt='User Profile'
                                />
                            </div>
                            <div className='chat-list'>
                                <h4 className='title-name'>
                                    <span>{room.roomName}</span>
                                    {notifications.map((notify) =>
                                        notify.roomName === room.roomName &&
                                        notify.hasNewMessage ? (
                                            <span
                                                className='ml-1 flex items-center relative'
                                                key={notify.roomName}
                                            >
                                                <Circle
                                                    fill='#86BC25'
                                                    size={25}
                                                    stroke='none'
                                                    className='circle-icon'
                                                />
                                                <span className='absolute text-xs font-bold text-white inset-0 flex items-center justify-center'>
                                                    {notify.newMessageCount}
                                                </span>
                                            </span>
                                        ) : null,
                                    )}
                                </h4>

                                {message.map(
                                    (chat) =>
                                        chat.roomName === room.roomName && (
                                            <div
                                                className='title-chat'
                                                key={chat.roomName}
                                            >
                                                {chat.messages.length > 0
                                                    ? chat.messages[
                                                          chat.messages.length -
                                                              1
                                                      ]?.user === user
                                                        ? `Me: ${
                                                              chat.messages[
                                                                  chat.messages
                                                                      .length -
                                                                      1
                                                              ]?.text
                                                          }`
                                                        : `${
                                                              chat.messages[
                                                                  chat.messages
                                                                      .length -
                                                                      1
                                                              ]?.user
                                                          }: ${
                                                              chat.messages[
                                                                  chat.messages
                                                                      .length -
                                                                      1
                                                              ]?.text
                                                          }`
                                                    : 'No messages available'}
                                            </div>
                                        ),
                                )}
                            </div>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
};

export default ListChat;
