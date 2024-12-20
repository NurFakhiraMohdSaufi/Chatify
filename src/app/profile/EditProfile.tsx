import imageCompression from 'browser-image-compression';
import { updateProfile } from 'firebase/auth';
import {
	collection,
	doc,
	getDocs,
	query,
	updateDoc,
	where,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { auth, db, storage } from '@/config/firebase-config';
import { Label } from '@radix-ui/react-dropdown-menu';

interface EditProfileProps {
    onProfileEdit: () => void;
}

export function EditProfile({onProfileEdit}: EditProfileProps) {
    const user = auth.currentUser?.displayName ?? '';
    const userData = auth.currentUser;
    const [userName, setUserName] = useState('');

    const [email, setEmail] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    const userRef = collection(db, 'users');

    useEffect(() => {
        if (userData?.displayName) {
            setUserName(userData.displayName);
            setEmail(userData.email);
        }
    }, [userData]);

    const handleUpdateName = async () => {
        try {
            if (userData) {
                // Update the display name in Firebase Authentication
                await updateProfile(userData, {
                    displayName: userName,
                    photoURL: imageFile,
                });

                // update name in messages table
                const messageRef = collection(db, 'messages');
                const qMessage = query(messageRef, where('user', '==', user));
                const queryMessageSnapshot = await getDocs(qMessage);

                if (!queryMessageSnapshot.empty) {
                    for (const docSnapshot of queryMessageSnapshot.docs) {
                        const docRef = doc(messageRef, docSnapshot.id);

                        await updateDoc(docRef, {
                            user: userName,
                        });
                    }
                }

                // update name in room table
                const roomRef = collection(db, 'room');
                const qRoom = query(roomRef, where('createdBy', '==', user));
                const queryRoomSnapshot = await getDocs(qRoom);

                if (!queryRoomSnapshot.empty) {
                    for (const docSnapshot of queryRoomSnapshot.docs) {
                        const docRef = doc(roomRef, docSnapshot.id);

                        await updateDoc(docRef, {
                            createdBy: userName,
                        });
                    }
                }

                // update name in user room table
                const userRoomRef = collection(db, 'userRooms');
                const qUserRoom = query(
                    userRoomRef,
                    where('userId', '==', user),
                );
                const queryUserRoomSnapshot = await getDocs(qUserRoom);

                if (!queryUserRoomSnapshot.empty) {
                    for (const docSnapshot of queryUserRoomSnapshot.docs) {
                        const docRef = doc(userRoomRef, docSnapshot.id);

                        await updateDoc(docRef, {
                            userId: userName,
                        });
                    }
                }

                // update name in users table
                const q = query(userRef, where('name', '==', user));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const userDocRef = doc(userRef, querySnapshot.docs[0].id);
                    await updateDoc(userDocRef, {
                        name: userName,
                        photoURL: imageFile,
                    });
                }
            }
            onProfileEdit();
            setOpen(false);
        } catch (error) {
            console.error('Error updating name: ', error);
        }
    };

    const handleEditImage = async (
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

                // Compress the image
                const compressedFile = await imageCompression(file, options);

                // Create a storage reference for the image
                const storageRef = ref(
                    storage,
                    `profile_images/${userData?.uid}`,
                );

                // Upload the compressed image to Firebase Storage
                const uploadTask = uploadBytesResumable(
                    storageRef,
                    compressedFile,
                );

                uploadTask.on(
                    'state_changed',
                    // (snapshot) => {},
                    (error) => {
                        console.error('Error uploading image:', error);
                    },
                    async () => {
                        const downloadURL = await getDownloadURL(
                            uploadTask.snapshot.ref,
                        );

                        setImageFile(downloadURL);
                        console.log('imageFile: ', imageFile);
                    },
                );
            } catch (error) {
                console.error('Error compressing image:', error);
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Image
                    src={
                        userData?.photoURL ||
                        'https://i.pinimg.com/736x/d2/98/4e/d2984ec4b65a8568eab3dc2b640fc58e.jpg'
                    }
                    width={200}
                    height={200}
                    alt='Avatar'
                    onClick={() => setOpen(true)}
                    title='Edit Profile'
                />
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px] bg-black text-white'>
                <DialogHeader>
                    <DialogTitle className='text-left font-bold'>
                        Edit Profile
                    </DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you
                        are done.
                    </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                    <div className='flex justify-center items-center p-7'>
                        <div className='relative'>
                            {/* Profile image container with rounded border and shadow */}
                            <div className='h-40 w-40 rounded-full overflow-hidden border-4 border-whatsapp flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300'>
                                <Image
                                    src={
                                        imageFile ||
                                        userData?.photoURL ||
                                        'https://i.pinimg.com/736x/d2/98/4e/d2984ec4b65a8568eab3dc2b640fc58e.jpg'
                                    }
                                    width={160}
                                    height={160}
                                    alt='Avatar'
                                    className='object-cover transform hover:scale-105 transition-transform duration-300' // Smooth zoom effect on hover
                                />
                            </div>

                            <label
                                htmlFor='profile-upload'
                                className='absolute bottom-0 right-5 bg-whatsapp text-white cursor-pointer flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 transform hover:scale-110'
                                title='Edit Profile Picture'
                            >
                                <span className='mdi mdi-camera text-lg'></span>{' '}
                                {/* Adjust icon size */}
                            </label>
                            <input
                                id='profile-upload'
                                type='file'
                                accept='image/*'
                                style={{display: 'none'}}
                                onChange={handleEditImage}
                            />
                        </div>
                    </div>

                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label className='text-right'>Name</Label>
                        <Input
                            className='col-span-3 bg-black text-white border-[#86BC25] focus:ring-[#86BC25] hover:scale-105 transition-all'
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            title='Change Username'
                        />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label className='text-right'>Email</Label>
                        <Input
                            className='cursor-pointer col-span-3 bg-black text-white border-[#86BC25] focus:ring-[#86BC25] hover:scale-105 transition-all'
                            value={email || ''}
                            readOnly
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        className='bg-whatsapp text-black px-6 py-3 rounded-md hover:bg-white hover:text-black focus:ring-2 focus:ring-[#86BC25] transform hover:scale-105 transition-all duration-300'
                        type='submit'
                        onClick={handleUpdateName}
                    >
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
