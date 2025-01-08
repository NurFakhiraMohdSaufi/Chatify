import imageCompression from 'browser-image-compression';
import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	query,
	updateDoc,
	where,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import Image from 'next/image';
import { useEffect, useState } from 'react';

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
import { ScrollArea } from '@/components/ui/scroll-area';
import { auth, db, storage } from '@/config/firebase-config';
import { Label } from '@radix-ui/react-dropdown-menu';

interface Room {
    room: string;
}

export function RoomInfo({room}: Room) {
    const [roomDesc, setRoomDesc] = useState('');
    const [roomName, setRoomName] = useState('');
    const [idRoom, setIdRoom] = useState('');
    const [imageRoomFile, setImageRoomFile] = useState<string | null>(null);
    const [createdBy, setCreatedBy] = useState<string | null>(null); // Store creator info
    const [members, setMembers] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false); // For leave room confirmation dialog
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false); // For delete room confirmation dialog

    const defaultImageProfile =
        'https://static.vecteezy.com/system/resources/previews/026/019/617/original/group-profile-avatar-icon-default-social-media-forum-profile-photo-vector.jpg';

    //  Firebase
    const roomRef = collection(db, 'room');
    const userRoomsRef = collection(db, 'userRooms');

    useEffect(() => {
        const fetchRoomDesc = async () => {
            const qRoom = query(roomRef, where('room', '==', room));
            const queryRoomSnapshot = await getDocs(qRoom);

            if (!queryRoomSnapshot.empty) {
                const RoomData = queryRoomSnapshot.docs[0].data();
                setRoomDesc(
                    RoomData.roomDesc || 'No room description available',
                );
                setRoomName(RoomData.room);
                setIdRoom(queryRoomSnapshot.docs[0].id);
                setImageRoomFile(RoomData.roomPhotoURL);
                setCreatedBy(RoomData.createdBy);
            }

            // Fetch room members
            const qMembers = query(userRoomsRef, where('roomId', '==', room));
            const queryMembersSnapshot = await getDocs(qMembers);

            if (!queryMembersSnapshot.empty) {
                const membersList = queryMembersSnapshot.docs.map(
                    (doc) => doc.data().userId,
                );
                setMembers(membersList);
            }
        };

        fetchRoomDesc();
    }, [room]);

    const handleUpdateRoomInfo = async () => {
        const qRoom = query(roomRef, where('room', '==', room));
        const queryRoomSnapshot = await getDocs(qRoom);

        if (!queryRoomSnapshot.empty) {
            const roomDocRef = doc(roomRef, queryRoomSnapshot.docs[0].id);

            await updateDoc(roomDocRef, {
                roomDesc: roomDesc,
                room: roomName,
                roomPhotoURL: imageRoomFile || '',
            });
        }

        // Update name in messages table
        const messageRef = collection(db, 'messages');
        const qMessage = query(messageRef, where('room', '==', room));
        const queryMessageSnapshot = await getDocs(qMessage);

        if (!queryMessageSnapshot.empty) {
            for (const docSnapshot of queryMessageSnapshot.docs) {
                const docRef = doc(messageRef, docSnapshot.id);
                await updateDoc(docRef, {
                    room: roomName,
                });
            }
        }

        // Update name in user room table
        const userRoomRef = collection(db, 'userRooms');
        const qUserRoom = query(userRoomRef, where('roomId', '==', room));
        const queryUserRoomSnapshot = await getDocs(qUserRoom);

        if (!queryUserRoomSnapshot.empty) {
            for (const docSnapshot of queryUserRoomSnapshot.docs) {
                const docRef = doc(userRoomRef, docSnapshot.id);
                await updateDoc(docRef, {
                    roomId: roomName,
                });
            }
        }

        setOpen(false);
    };

    const handleEditGroupImages = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        try {
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 500,
                useWebWorker: true,
            };

            const compressedFile = await imageCompression(file, options);

            const storageRef = ref(storage, `room_images/${idRoom}`);

            const uploadTask = uploadBytesResumable(storageRef, compressedFile);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                (error) => {
                    console.error('Upload failed:', error);
                },
                async () => {
                    const downloadURL = await getDownloadURL(
                        uploadTask.snapshot.ref,
                    );
                    setImageRoomFile(downloadURL);
                    console.log('File available at', downloadURL);
                },
            );
        } catch (error) {
            console.error('Error compressing image:', error);
        }
    };

    const isCreator = createdBy === auth.currentUser?.displayName;

    const handleLeaveRoom = async () => {
        try {
            const qUserRoom = query(
                userRoomsRef,
                where('userId', '==', auth.currentUser?.displayName),
                where('roomId', '==', room),
            );
            const querySnapshot = await getDocs(qUserRoom);

            if (!querySnapshot.empty) {
                const docId = querySnapshot.docs[0].id;
                const docRef = doc(userRoomsRef, docId);
                await deleteDoc(docRef);

                console.log('User left the room.');

                // Optionally update state to reflect the user leaving
                setMembers((prevMembers) =>
                    prevMembers.filter(
                        (member) => member !== auth.currentUser?.displayName,
                    ),
                );
                setOpen(false); // Close the dialog
                setOpenConfirm(false); // Close the confirmation popup
            } else {
                console.log('User is not part of the room.');
            }
        } catch (error) {
            console.error('Error leaving room: ', error);
        }
    };

    const handleDeleteRoom = async () => {
        try {
            const qRoom = query(roomRef, where('room', '==', room));
            const queryRoomSnapshot = await getDocs(qRoom);

            if (!queryRoomSnapshot.empty) {
                const roomDocRef = doc(roomRef, queryRoomSnapshot.docs[0].id);

                // Delete messages related to the room
                const messageRef = collection(db, 'messages');
                const qMessage = query(messageRef, where('room', '==', room));
                const queryMessageSnapshot = await getDocs(qMessage);
                queryMessageSnapshot.forEach((messageDoc) => {
                    deleteDoc(doc(messageRef, messageDoc.id));
                });

                // Delete userRoom entries related to the room
                const userRoomRef = collection(db, 'userRooms');
                const qUserRoom = query(
                    userRoomRef,
                    where('roomId', '==', room),
                );
                const queryUserRoomSnapshot = await getDocs(qUserRoom);
                queryUserRoomSnapshot.forEach((userRoomDoc) => {
                    deleteDoc(doc(userRoomRef, userRoomDoc.id));
                });
                setOpen(false); // Close the dialog
                setOpenConfirm(false); // Close the confirmation popup

                // Finally, delete the room document
                await deleteDoc(roomDocRef);

                console.log('Room deleted successfully');
            }

            setOpenDeleteConfirm(false); // Close the delete confirmation dialog
        } catch (error) {
            console.error('Error deleting room: ', error);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <button
                        type='button'
                        className='mdi mdi-information-outline text-white hover:text-[#86BC25] transition-all duration-300 transform hover:scale-125'
                        onClick={() => setOpen(true)}
                    ></button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-[425px] bg-black text-white overflow-y-auto flex flex-col'>
                    <DialogHeader>
                        <DialogTitle className='text-white'>
                            Room Info
                        </DialogTitle>
                        <DialogDescription className='text-white'>
                            Make changes to your room here. Click save when you
                            are done.
                        </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className='flex-1 overflow-y-auto max-h-[350px] hover:border-2 hover:border-[#86BC25] transition-all p-3 bg-transparent'>
                        <div className='grid gap-4 py-4'>
                            <div className='flex justify-center items-center p-7'>
                                <div className='relative'>
                                    <div className='h-40 w-40 rounded-full overflow-hidden border-2 border-[#86BC25] flex items-center justify-center hover:scale-105 transition-all'>
                                        <Image
                                            src={
                                                imageRoomFile ||
                                                defaultImageProfile
                                            }
                                            width={200}
                                            height={200}
                                            alt='Avatar'
                                            className='transition-transform duration-300'
                                        />
                                    </div>

                                    <label
                                        htmlFor='imageRoom-upload'
                                        className='absolute bottom-0 right-5 bg-chatify text-white cursor-pointer flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 transform hover:scale-110'
                                        title='Edit Group Profile Picture'
                                    >
                                        <span className='mdi mdi-camera text-lg'></span>{' '}
                                    </label>
                                    <input
                                        id='imageRoom-upload'
                                        type='file'
                                        accept='image/*'
                                        style={{display: 'none'}}
                                        onChange={handleEditGroupImages}
                                    />
                                </div>
                            </div>
                            <div className='grid items-center gap-4'>
                                <Label className='text-base font-semibold text-white'>
                                    Room Name:
                                </Label>
                                <Input
                                    id='name'
                                    value={roomName}
                                    className='col-span-3 bg-black text-white border-[#86BC25] focus:ring-[#86BC25] hover:scale-105 transition-all'
                                    onChange={(e) =>
                                        setRoomName(e.target.value)
                                    }
                                    style={{color: 'white'}}
                                />
                            </div>

                            <div className='grid items-center gap-4'>
                                <Label className='text-base font-semibold text-white'>
                                    Room Description:
                                </Label>
                                <Input
                                    id='desc'
                                    value={roomDesc}
                                    className='col-span-3 bg-black text-white border-[#86BC25] focus:ring-[#86BC25] hover:scale-105 transition-all'
                                    onChange={(e) =>
                                        setRoomDesc(e.target.value)
                                    }
                                    style={{color: 'white'}}
                                />
                            </div>

                            <div className='grid items-center gap-4'>
                                <h6 className='text-base font-semibold text-white'>
                                    Room Member(s):
                                </h6>
                                <ul>
                                    {members.length > 0 ? (
                                        members.map((memberId, index) => (
                                            <li
                                                key={index}
                                                className='text-sm text-white'
                                            >
                                                {memberId}
                                            </li>
                                        ))
                                    ) : (
                                        <li className='text-sm text-white'>
                                            No members yet
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </ScrollArea>

                    <DialogFooter>
                        <Button
                            className='bg-chatify text-black px-6 py-3 rounded-md hover:bg-white hover:text-black focus:ring-2 focus:ring-[#86BC25] transform hover:scale-105 transition-all duration-300'
                            type='submit'
                            onClick={handleUpdateRoomInfo}
                        >
                            Save Changes
                        </Button>
                        <Button
                            className='text-white bg-black hover:black-500 hover:text-red-600 focus:ring-2 focus:ring-red-500 rounded-full p-2 transform hover:scale-110 transition-all duration-3'
                            type='button'
                            onClick={() => setOpenConfirm(true)}
                        >
                            <i className='mdi mdi-exit-to-app text-2xl'></i>{' '}
                        </Button>
                        {isCreator && (
                            <Button
                                className='text-white bg-black hover:black-500 hover:text-red-600 focus:ring-2 focus:ring-red-500 rounded-full p-2 transform hover:scale-110 transition-all duration-3'
                                type='button'
                                onClick={() => setOpenDeleteConfirm(true)}
                            >
                                <i className='mdi mdi-delete text-2xl'></i>{' '}
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Leave Room Confirmation Dialog */}
            <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
                <DialogContent className='sm:max-w-[400px] bg-black text-white'>
                    <DialogHeader>
                        <DialogTitle className='text-white'>
                            Are you sure?
                        </DialogTitle>
                        <DialogDescription className='text-white'>
                            Are you sure you want to leave this room? This
                            action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            className='bg-red-500 text-black px-6 py-3 rounded-md hover:bg-red-600 hover:text-white focus:ring-2 focus:ring-red-500 transform hover:scale-105 transition-all duration-300'
                            type='button'
                            onClick={() => setOpenConfirm(false)} // Close confirmation dialog
                        >
                            Cancel
                        </Button>
                        <Button
                            className='bg-[#86BC25] text-black px-6 py-3 rounded-md hover:bg-[#86BC25]  hover:text-white focus:ring-2 focus:ring-[#86BC25] transform hover:scale-105 transition-all duration-300'
                            type='button'
                            onClick={handleLeaveRoom} // Proceed to leave room
                        >
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Room Confirmation Dialog */}
            <Dialog
                open={openDeleteConfirm}
                onOpenChange={setOpenDeleteConfirm}
            >
                <DialogContent className='sm:max-w-[400px] bg-black text-white'>
                    <DialogHeader>
                        <DialogTitle className='text-white'>
                            Are you sure?
                        </DialogTitle>
                        <DialogDescription className='text-white'>
                            Are you sure you want to delete this room? This
                            action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            className='bg-red-500 text-black px-6 py-3 rounded-md hover:bg-red-600 hover:text-white focus:ring-2 focus:ring-red-500 transform hover:scale-105 transition-all duration-300'
                            type='button'
                            onClick={() => setOpenDeleteConfirm(false)} // Close delete confirmation dialog
                        >
                            Cancel
                        </Button>
                        <Button
                            className='bg-[#86BC25] text-black px-6 py-3 rounded-md hover:bg-[#86BC25]  hover:text-white focus:ring-2 focus:ring-[#86BC25] transform hover:scale-105 transition-all duration-300'
                            type='button'
                            onClick={handleDeleteRoom} // Proceed to delete room
                        >
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
