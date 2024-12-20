import { useEffect, useState } from 'react';

import { auth } from '@/config/firebase-config';

import { EditProfile } from './EditProfile';

export function ProfileUser() {
    const [userName, setUserName] = useState('');
    const userData = auth.currentUser;

    const refreshUserInfo = async () => {
        if (userData) {
            await userData.reload();
            setUserName(userData?.displayName || '');
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserName(user.displayName || '');
            }
        });
        return () => unsubscribe();
    }, []);

    const handleProfileEdit = async () => {
        await refreshUserInfo();
    };

    return (
        <div className='flex flex-row items-center space-x-4 p-2'>
            <div className='cursor-pointer h-10 w-10 rounded-full overflow-hidden '>
                <EditProfile onProfileEdit={handleProfileEdit} />
            </div>

            <div className='flex-grow text-sm font-semibold text-white'>
                {userName}
            </div>
        </div>
    );
}
