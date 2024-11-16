import React, { createContext, useState, ReactNode } from 'react';

// Define the context value type
interface OpenCloseContextType {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
    id: string | null;
    setId: (id: string | null) => void;
    setIsOpen: (value:boolean) => void;
}

// Create Context with an initial value of `undefined`
const AddFolderContext = createContext<OpenCloseContextType | undefined>(undefined);
// Define the props for the Provider component
interface OpenCloseProviderProps {
    children: ReactNode;
}

// Provider Component
const AddFolderProvider: React.FC<OpenCloseProviderProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [id, setId] = useState<string | null>(null);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    const toggle = () => setIsOpen(prev => !prev);

    return (
        <AddFolderContext.Provider value={{ isOpen, open, close, toggle, id, setId, setIsOpen }}>
            {children}
        </AddFolderContext.Provider>
    );
};

export { AddFolderContext, AddFolderProvider }