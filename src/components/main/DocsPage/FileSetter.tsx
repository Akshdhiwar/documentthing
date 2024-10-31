import useEditChangesStore from '@/store/changes';
import useEditorStore from '@/store/editorStore';
import useFolderStore from '@/store/folderStore';
import { useEffect } from 'react';

const FileSetter = () => {
    // Use Zustand hooks to get the current state
    const {selectedFolder , Url} = useFolderStore(state => state);
    const { editedFiles, setEditedFiles, addEditedFile, setMarkdownFiles, addEditedMarkdown, isEditing, editedMarkdown } = useEditChangesStore(state => state);
    const { content, initialContent, markdown } = useEditorStore(state => state);

    // Callback to avoid re-creating the function on every render
    const setEditingContents =
        (value?: any) => {
            if (!selectedFolder) return;

            const folderId = selectedFolder.id;
            const existingFile = editedFiles.find(file => file.id === folderId);

            if (existingFile) {
                // Update only if the content has actually changed
                const newContent = value;
                if (existingFile.changedContent !== newContent) {
                    const updatedFiles = editedFiles.map(file =>
                        file.id === folderId ? { ...file, changedContent: newContent } : file
                    );
                    setEditedFiles(updatedFiles);

                    const updatedMarkdownFiles = editedMarkdown.map(file => {
                        return file.id === folderId ? { ...file , changedContent : markdown } : file;
                    })

                    setMarkdownFiles(updatedMarkdownFiles)
                }
            } else {
                addEditedFile(
                    folderId,
                    "file",
                    value,
                    value,
                    selectedFolder.name
                );
                const url = Url
                const flag = Url.includes("/")
                addEditedMarkdown(folderId ,"markdown" , null , markdown ,null , flag ? url.replace(/\s*\/\s*/, '/') + ".md" : selectedFolder.name + ".md")
            }
        }

    // Effect to handle editor changes
    useEffect(() => {
        if (!isEditing) return;
        if (JSON.stringify(initialContent) === JSON.stringify(content)) return
        setEditingContents(content);
    }, [content]);

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
