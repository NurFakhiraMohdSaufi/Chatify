import React, { createContext, ReactNode, useContext, useState } from 'react';

interface ChatContextType {
    room: string | null;
    setRoom: (room: string | null) => void;
    isInChat: boolean;
    setIsInChat: (isInChat: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
};

interface ChatProviderProps {
    children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({children}) => {
    const [room, setRoom] = useState<string | null>(null);
    const [isInChat, setIsInChat] = useState(false);

    return (
        <ChatContext.Provider value={{room, setRoom, isInChat, setIsInChat}}>
            {children}
        </ChatContext.Provider>
    );
};
