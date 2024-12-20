import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { MessageCirclePlusIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { auth, db } from '@/config/firebase-config';
import { IconButton } from '@mui/material';

interface CreateRoomProps {
    setIsInChat: (isInChat: boolean) => void;
}

export function CreateGroup({setIsInChat}: CreateRoomProps) {
    const [open, setOpen] = useState(false);
    const [roomName, setRoomName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreateNewRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        if (roomName.trim() === '') {
            setError('Room name cannot be empty');
            return;
        }

        setLoading(true);
        setError('');
        try {
            // Create a new room
            await addDoc(collection(db, 'room'), {
                room: roomName,
                createdAt: serverTimestamp(),
                createdBy: auth.currentUser?.displayName,
                roomDesc: 'Type your group description here...',
            });

            // Add user to userRooms collection
            await addDoc(collection(db, 'userRooms'), {
                userId: auth.currentUser?.displayName,
                roomId: roomName,
                joinedAt: serverTimestamp(),
            });

            setIsInChat(true);
            setRoomName('');
            setOpen(false);
        } catch {
            setError('Failed to create room. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <IconButton className='bg-[#86BC25] p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110'>
                    <MessageCirclePlusIcon
                        className='text-white text-lg hover:text-whatsapp'
                        onClick={() => setOpen(true)}
                    >
                        <title>Create New Chat Room</title>
                    </MessageCirclePlusIcon>
                </IconButton>
            </DialogTrigger>
            <DialogContent className='bg-black p-6 rounded-xl shadow-lg transition-all duration-500 transform hover:scale-105'>
                <DialogHeader>
                    <DialogTitle className='text-2xl font-semibold text-[#86BC25]'>
                        Create New Room
                    </DialogTitle>
                </DialogHeader>
                <div className='grid grid-cols-1 gap-6'>
                    <Input
                        className='p-3 border-2 border-white rounded-md focus:outline-none focus:border-[#86BC25] transition-all duration-300 transform hover:scale-105 text-white bg-transparent'
                        placeholder='New Room'
                        value={roomName}
                        onChange={(e) => {
                            setRoomName(e.target.value);
                            if (error) setError('');
                        }}
                        autoFocus
                    />
                    {error && (
                        <p className='text-sm text-red-600 font-medium transition-all duration-300 transform'>
                            {error}
                        </p>
                    )}
                </div>

                <DialogFooter className='flex justify-between'>
                    {/* Close Button */}
                    <Button
                        type='button'
                        className='bg-[#86BC25] text-black px-6 py-3 rounded-md hover:bg-white hover:text-black focus:ring-2 focus:ring-[#86BC25] transition-all duration-300 transform hover:scale-105'
                        onClick={() => setOpen(false)} // Closes the modal
                    >
                        Close
                    </Button>

                    {/* Create Button */}
                    <Button
                        type='submit'
                        className='bg-[#86BC25] text-black px-6 py-3 rounded-md hover:bg-white hover:text-black focus:ring-2 focus:ring-[#86BC25] transition-all duration-300 transform hover:scale-105'
                        onClick={handleCreateNewRoom}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className='animate-spin inline-block'>
                                Creating...
                            </span>
                        ) : (
                            'Create'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
