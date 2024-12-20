import '@/styles/Room.css';

import { signOut } from 'firebase/auth';
import { LogOutIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';

import ListChat from '@/app/chat/ListChat';
import { SearchRoom } from '@/app/chat/SearchRoom';
import { ProfileUser } from '@/app/profile/ProfileUser';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarTrigger,
} from '@/components/ui/sidebar';
import { auth } from '@/config/firebase-config';
import logo from '@/images/logo-chatify.png';
import { IconButton } from '@mui/material';

const cookies = new Cookies();

interface Room {
    setRoom: (room: string) => void;
    setIsInChat: (isInChat: boolean) => void;
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

export function AppSidebar({
    setRoom,
    setIsInChat,
    isSidebarOpen,
    toggleSidebar,
}: Room) {
    // Track the screen size and toggle sidebar visibility
    const [isMobile, setIsMobile] = useState(false);

    const signUserOut = async () => {
        await signOut(auth);
        cookies.remove('auth-token');
        setIsInChat(false);
    };

    // Hook to monitor screen size
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 500) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
        };

        // Initial check
        handleResize();

        // Add event listener to handle resizing
        window.addEventListener('resize', handleResize);

        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Debug: Log the state of isMobile and isSidebarOpen
    useEffect(() => {
        console.log('isMobile:', isMobile);
        console.log('isSidebarOpen:', isSidebarOpen);
    }, [isMobile, isSidebarOpen]);

    return (
        <Sidebar
            className={`bg-gray-800 text-white flex flex-col h-screen ${
                isSidebarOpen || isMobile ? 'block' : 'hidden'
            }`}
        >
            <div className='flex items-center justify-between border-b border-gray-700 p-1 h-14'>
                <SidebarHeader>
                    <Image
                        src={logo}
                        width={100}
                        height={100}
                        alt='Chatify Logo'
                    />
                </SidebarHeader>

                <SidebarTrigger onClick={toggleSidebar} />
            </div>

            <ScrollArea className='flex-grow'>
                <SidebarContent className='border-b border-gray-700'>
                    <SidebarGroup>
                        <SidebarGroupContent className='flex flex-col'>
                            <SidebarMenu className='flex-grow'>
                                <SidebarMenuItem>
                                    <SearchRoom
                                        setRoom={setRoom}
                                        setIsInChat={setIsInChat}
                                    />
                                    <ListChat
                                        setRoom={setRoom}
                                        setIsInChat={setIsInChat}
                                    />
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </ScrollArea>

            <SidebarFooter className='border-t border-gray-700'>
                <div className='flex flex-row justify-between items-center'>
                    <div className='relative flex-grow'>
                        <ProfileUser />
                    </div>
                    <div className='ml-2'>
                        <IconButton>
                            <LogOutIcon
                                className='justify-between text-sm font-semibold text-white hover:text-red-500'
                                onClick={signUserOut}
                            />
                        </IconButton>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
