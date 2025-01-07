import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type editedFilesInterface = {
    type: "file" | "folder" | "markdown",
    path: string | null,
    name: string | null,
    id: string | null,
    originalContent: any,
    changedContent: any,
}

type editorStoreType = {
    isEditing: boolean;
    setIsEditing: (data: boolean) => void;
    editedFiles: editedFilesInterface[];
    editedFolder: editedFilesInterface[];
    editedMarkdown: editedFilesInterface[];
    setEditedFolder: (data: editedFilesInterface[]) => void
    setEditedFiles: (data: editedFilesInterface[]) => void
    setMarkdownFiles: (data: editedFilesInterface[]) => void,
    addEditedFile: (id: string | null, type: "file" | "folder", ogContent: any, modifiedContent: any, name: string | null) => void;
    addEditedFolder: (id: string | null, type: "file" | "folder", ogContent: any, modifiedContent: any, name: string | null) => void;
    addEditedMarkdown: (id: string | null, type: "markdown", ogContent: any, modifiedContent: any, name: string | null, path: string) => void;
    reset: () => void
}

const useEditChangesStore = create<editorStoreType>()(
    persist(
        (set) => ({
            isEditing: false,
            setIsEditing: (data: boolean) => {
                set(() => ({
                    isEditing: data,
                }));
            },
            editedFiles: [],
            editedFolder: [],
            editedMarkdown: [],
            addEditedMarkdown: (id, type, ogContent, modifiedContent, name, path) => {
                set((state) => ({
                    editedMarkdown: [
                        ...state.editedMarkdown,
                        {
                            type: type,
                            path: path,
                            name: name,
                            id: id,
                            originalContent: ogContent,
                            changedContent: modifiedContent,
                        }
                    ]
                }))
            },
            setEditedFolder: (data: editedFilesInterface[]) => {
                set(() => ({
                    editedFolder: data
                }));
            },
            setEditedFiles: (data: editedFilesInterface[]) => {
                set(() => ({
                    editedFiles: data
                }));
            },
            setMarkdownFiles: (data: editedFilesInterface[]) => {
                set(() => ({
                    editedMarkdown: data
                }))
            },
            addEditedFile: (id, type, ogContent, modifiedContent, name) => {
                set((state) => ({
                    ...state,
                    editedFiles: [
                        ...state.editedFiles,
                        {
                            type: type,
                            path: id ? `Documentthing/files/${id}.json` : null,
                            name: name,
                            id: id,
                            originalContent: ogContent,
                            changedContent: modifiedContent,
                        }
                    ]
                }));
            },
            reset: () => {
                set(() => ({
                    isEditing: false,
                    editedFiles: [],
                    editedFolder: [],
                    editedMarkdown: [],
                }));
            },
            addEditedFolder: (id, type, ogContent, modifiedContent, name) => {
                set((state) => ({
                    ...state,
                    editedFolder: [
                        {
                            type: type,
                            path: `Documentthing/folder/folder.json`,
                            name: name,
                            id: id,
                            originalContent: ogContent,
                            changedContent: modifiedContent,
                        }
                    ]
                }));
            },
        }),
        {
            name: 'change-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // using sessionStorage; default is localStorage
        }
    )
);

export default useEditChangesStore;
