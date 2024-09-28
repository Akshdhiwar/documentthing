import useEditChangesStore from '@/store/changes';
import useEditorStore from '@/store/editorStore';
import useFolderStore from '@/store/folderStore';
import { useEffect, useState, useCallback } from 'react';

const FileSetter = () => {
    // Use Zustand hooks to get the current state
    const selectedFolder = useFolderStore(state => state.selectedFolder);
    const { editedFiles, setEditedFiles, addEditedFile } = useEditChangesStore(state => state);
    const { editor } = useEditorStore(state => state);
    const [content, setContent] = useState<any>("");

    // Callback to avoid re-creating the function on every render
    const setEditingContents = useCallback(
        (value?: any) => {
            if (!selectedFolder) return;

            const folderId = selectedFolder.id;
            const existingFile = editedFiles.find(file => file.id === folderId);

            if (existingFile) {
                // Update only if the content has actually changed
                const newContent = JSON.stringify(value ?? content);
                if (existingFile.changedContent !== newContent) {
                    const updatedFiles = editedFiles.map(file =>
                        file.id === folderId ? { ...file, changedContent: newContent } : file
                    );
                    setEditedFiles(updatedFiles);
                }
            } else {
                addEditedFile(
                    folderId,
                    "file",
                    JSON.stringify(value ?? content),
                    JSON.stringify(value ?? content),
                    selectedFolder.name
                );
            }
        },
        [selectedFolder, editedFiles, content, setEditedFiles, addEditedFile]
    );

    // Effect to handle editor changes
    useEffect(() => {
        if (!editor) return;

        const handleChange = (value: any) => {
            setContent(value);
            setEditingContents(value);
        };

        editor.on('change', handleChange);
        return () => {
            editor.off('change', handleChange);
        };
    }, [editor, setEditingContents]);

    // // Effect to handle changes in the selected folder
    // useEffect(() => {
    //     if (selectedFolder) {
    //         console.log("Selected folder changed:", selectedFolder);
    //         // Optionally update the content based on selectedFolder change
    //     }
    // }, [selectedFolder]);

    return null;
};

export default FileSetter;
