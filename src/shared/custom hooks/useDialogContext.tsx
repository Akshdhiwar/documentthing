import { AddFolderContext } from '@/store/addFolder.context';
import { useContext } from 'react';

const useAddFolderContext = () => {
    const context = useContext(AddFolderContext);
    if (!context) {
        throw new Error('useAddFolderContext must be used within an AddFolderProvider');
    }
    return context;
};

export default useAddFolderContext;