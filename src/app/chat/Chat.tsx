import '@/styles/Chat.css';
import '@mdi/font/css/materialdesignicons.min.css';

import imageCompression from 'browser-image-compression';
import {
	addDoc,
	collection,
	getDocs,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	Timestamp,
	where,
} from 'firebase/firestore';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

import { auth, db } from '@/config/firebase-config';

import { RoomInfo } from './RoomInfo';

interface Room {
    room: string;
}

interface Message {
    id: string;
    text: string;
    user: string;
    createdAt: Timestamp;
    room: string;
    replyTo: string | null;
    image?: string | null;
}

export default function Room({room}: Room) {
    const [newMessage, setNewMessage] = useState('');

    const [messages, setMessages] = useState<Message[]>([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [emojiCategory, setEmojiCategory] =
        useState<keyof typeof emojis>('😊'); // Default category to Smileys emoji
    const [replyToMessageText, setReplyToMessageText] = useState<string | null>(
        '',
    );
    const [imageFile, setImageFile] = useState<string | null>(null);
    const [imageRoom, setImageRoom] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const messagesRef = collection(db, 'messages');

    // Fetch messages from Firebase
    useEffect(() => {
        const queryMessages = query(
            messagesRef,
            where('room', '==', room),
            orderBy('createdAt'),
        );

        const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
            const messages: Message[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                messages.push({
                    id: doc.id,
                    text: data.text || '',
                    user: data.user || 'Unknown',
                    createdAt: data.createdAt || null,
                    room: data.room || room,
                    replyTo: data.replyTo || null,
                    image: data.image || null,
                });
            });

            const roomRef = collection(db, 'room');

            const fetchRoom = async () => {
                const qRoom = query(roomRef, where('room', '==', room));
                const queryRoomSnapshot = await getDocs(qRoom);

                if (!queryRoomSnapshot.empty) {
                    const RoomData = queryRoomSnapshot.docs[0].data();

                    setImageRoom(RoomData.roomPhotoURL);
                }
            };

            fetchRoom();
            setMessages(messages);
        });

        return () => unsubscribe();
    }, [room]);

    // Submit message
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newMessage === '' && !imageFile) return;

        const newMessageData = {
            text: newMessage,
            createdAt: serverTimestamp(),
            user: auth.currentUser?.displayName,
            room: room,
            replyTo: replyToMessageText || null,
            image: imageFile || null,
        };

        await addDoc(messagesRef, newMessageData);
        setNewMessage('');
        setReplyToMessageText('');
        setImageFile(null);
    };

    const formatTimestamp = (timestamp: Timestamp) => {
        if (!timestamp) return '';
        return new Date(timestamp.seconds * 1000).toLocaleTimeString();
    };

    // Scroll to bottom of chat
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    };

    // Handle Enter key press for message submit
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
        }
    };

    // Handle image file change and compression
    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1024,
                    useWebWorker: true,
                };

                const compressedFile = await imageCompression(file, options);
                const reader = new FileReader();

                reader.onloadend = () => {
                    const base64String = reader.result as string;
                    setImageFile(base64String);
                };

                reader.readAsDataURL(compressedFile);
            } catch (error) {
                console.error('Error compressing image:', error);
            }
        }
    };

    // Handle remove image preview
    const handleRemoveImagePreview = () => {
        setImageFile(null);
    };

    // Handle reply to a message
    const handleReplyClick = (message: Message) => {
        if (message.user !== auth.currentUser?.displayName) {
            setReplyToMessageText(message.text || 'Image');
            if (message.image) {
                setImageFile(message.image);
            }
        }
    };

    // Handle emoji click
    const handleEmojiClick = (emoji: string) => {
        setNewMessage((prevMessage) => prevMessage + emoji);
        setShowEmojiPicker(false); // Close the emoji picker after selecting
    };

    // Emoji categories and emojis
    const emojis = {
        '😊': [
            '😊',
            '😂',
            '😍',
            '❤️',
            '😁',
            '😜',
            '😎',
            '🤔',
            '🥺',
            '🤗',
            '😢',
            '🥳',
            '😃',
            '😄',
            '😆',
            '😋',
            '😛',
            '😝',
            '😇',
            '🤩',
            '😌',
            '😏',
        ],
        '🐶': [
            '🐶',
            '🐱',
            '🐯',
            '🐸',
            '🦁',
            '🦊',
            '🐻',
            '🦄',
            '🐨',
            '🐵',
            '🐒',
            '🐼',
            '🦓',
            '🐧',
            '🦔',
            '🦇',
            '🦘',
            '🦣',
            '🦃',
            '🐾',
        ],
        '🍔': [
            '🍏',
            '🍔',
            '🍕',
            '🍣',
            '🍩',
            '🍪',
            '🍓',
            '🍉',
            '🍍',
            '🍇',
            '🍒',
            '🥗',
            '🥓',
            '🥩',
            '🥪',
            '🍲',
            '🍝',
            '🍛',
            '🍜',
            '🥘',
        ],
        '💻': [
            '💻',
            '📱',
            '📸',
            '🎧',
            '💼',
            '📚',
            '🏠',
            '🚗',
            '⚽',
            '🎮',
            '🖥️',
            '⌨️',
            '🖱️',
            '📺',
            '📡',
            '🔌',
            '🔋',
            '💡',
            '🕹️',
        ],
        '🌍': [
            '🌍',
            '🌎',
            '🗽',
            '🏕️',
            '🚢',
            '✈️',
            '🚉',
            '🏞️',
            '🏙️',
            '🌆',
            '🏜️',
            '🌄',
            '🏔️',
            '🏖️',
            '🌌',
            '🌋',
            '⛷️',
            '🛶',
            '🏝️',
        ],
        '❤️': [
            '❤️',
            '💔',
            '💯',
            '👍',
            '👎',
            '✨',
            '🔥',
            '⚡',
            '💥',
            '🧡',
            '💛',
            '💚',
            '💙',
            '💜',
            '💝',
            '💗',
            '💓',
            '💞',
            '❣️',
            '💌',
            '💕',
        ],
    } as const;

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    const defaultImageProfile =
        'https://static.vecteezy.com/system/resources/previews/026/019/617/original/group-profile-avatar-icon-default-social-media-forum-profile-photo-vector.jpg';

    return (
        <div className='chat-app'>
            <div className='header flex items-center justify-between p-4 bg-gray-50 border-b-2 border-gray-200 shadow-sm gap-6'>
                <div className='profile-container h-10 w-10 rounded-full overflow-hidden border-1 border-[#86BC25] flex items-center justify-center shadow-md transform hover:scale-110 hover:shadow-lg transition duration-300'>
                    <Image
                        src={imageRoom || defaultImageProfile}
                        width={200}
                        height={200}
                        alt='Group Profile Picture'
                        className='profile-picture object-cover w-full h-full'
                    />
                </div>
                <h1 className='header-title text-3xl font-semibold text-gray-800 uppercase tracking-wide text-center'>
                    {room.toUpperCase()}
                </h1>
                <div className='room-info flex-shrink-0'>
                    <RoomInfo room={room} />
                </div>
            </div>

            <div className='messages'>
                {messages.map((message) => (
                    <div
                        className={`message ${
                            message.user === auth.currentUser?.displayName
                                ? 'sent'
                                : 'received'
                        }`}
                        key={message.id}
                    >
                        <div className='message-header'>
                            {message.user !== auth.currentUser?.displayName && (
                                <span className='user'>{message.user}</span>
                            )}

                            {/* Reply button for received messages */}
                            {message.user !== auth.currentUser?.displayName && (
                                <button
                                    className='mdi mdi-reply reply-button'
                                    onClick={() => handleReplyClick(message)}
                                ></button>
                            )}
                        </div>

                        {/* Display image and make it smaller if it's part of a reply */}
                        {message.image && (
                            <div className='message-image'>
                                <Image
                                    src={message.image}
                                    width={200}
                                    height={200}
                                    alt='Image'
                                    onClick={() => handleReplyClick(message)}
                                    className={
                                        message.replyTo ? 'quoted-image' : ''
                                    }
                                />
                            </div>
                        )}

                        {/* Display message text below the image */}
                        <span className='text'>{message.text}</span>

                        {/* Display reply information if it's a reply */}
                        {message.replyTo && (
                            <div className='reply-info'>
                                <span className='reply-to'>
                                    Replying to: {message.replyTo}
                                </span>
                            </div>
                        )}

                        <span className='timestamp'>
                            {formatTimestamp(message.createdAt)}
                        </span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className='new-message-form'>
                {replyToMessageText && (
                    <div className='replying-to'>
                        <span>Replying to: {replyToMessageText}</span>
                        <button
                            type='button'
                            className='mdi mdi-close cancel-reply-button'
                            onClick={() => setReplyToMessageText('')}
                        ></button>
                    </div>
                )}

                {/* Image Preview Section */}
                {imageFile && (
                    <div className='image-preview'>
                        <Image
                            src={imageFile}
                            width={200}
                            height={200}
                            alt='Image preview'
                        />
                        <button
                            type='button'
                            className='mdi mdi-close-circle close-preview-button'
                            onClick={handleRemoveImagePreview}
                        ></button>
                    </div>
                )}

                <div className='relative flex items-center w-full'>
                    <button
                        type='button'
                        className='mdi mdi-emoticon-outline emoticon-button'
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    ></button>

                    <input
                        className='new-message-input'
                        placeholder='Type a message...'
                        onKeyDown={handleKeyDown}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <div className='icon-buttons'>
                        <label
                            htmlFor='image-upload'
                            className='mdi mdi-camera camera-button'
                        ></label>
                        <input
                            id='image-upload'
                            type='file'
                            accept='image/*'
                            style={{display: 'none'}}
                            onChange={handleFileChange}
                        />
                    </div>

                    <button
                        type='submit'
                        className='mdi mdi-send send-button border-white border-2 hover:text-whatsapp'
                        disabled={newMessage === '' && !imageFile}
                    ></button>
                </div>

                {/* Emoji Picker */}
                {showEmojiPicker && (
                    <div className='emoji-picker'>
                        <div className='emoji-categories'>
                            {Object.keys(emojis).map((category) => (
                                <button
                                    key={category}
                                    className={`emoji-category ${
                                        emojiCategory === category
                                            ? 'active'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        setEmojiCategory(
                                            category as keyof typeof emojis,
                                        )
                                    }
                                >
                                    {category}{' '}
                                    {/* Use the emoji key for display */}
                                </button>
                            ))}
                        </div>
                        <div className='emoji-grid'>
                            {(emojis[emojiCategory] as readonly string[]).map(
                                (emoji: string) => (
                                    <button
                                        key={emoji}
                                        className='emoji'
                                        onClick={() => handleEmojiClick(emoji)}
                                    >
                                        {emoji}
                                    </button>
                                ),
                            )}
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
