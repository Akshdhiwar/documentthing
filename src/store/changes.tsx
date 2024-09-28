import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type editedFilesInterface = {
    type: "file" | "folder",
    path: string | null,
    name: string | null,
    id: string | null,
    originalContent: string | null,
    changedContent: string | null,
}

type editorStoreType = {
    isEditing: boolean;
    setIsEditing: (data: boolean) => void;
    editedFiles: editedFilesInterface[];
    editedFolder : editedFilesInterface[];
    setEditedFolder : (data : editedFilesInterface[]) => void
    setEditedFiles : (data : editedFilesInterface[]) => void
    addEditedFile: (id: string | null, type: "file" | "folder", ogContent: string | null, modifiedContent: string | null, name: string | null) => void;
    addEditedFolder: (id: string | null, type: "file" | "folder", ogContent: string | null, modifiedContent: string | null, name: string | null) => void;
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
            editedFolder : [],
            setEditedFolder : (data : editedFilesInterface[]) => {
                set(() => ({
                    editedFolder: data
                }));
            },
            setEditedFiles : (data : editedFilesInterface[]) => {
                set(() => ({
                    editedFiles: data
                }));
            },
            addEditedFile: (id, type, ogContent, modifiedContent, name) => {
                set((state) => ({
                    ...state,
                    editedFiles: [
                        ...state.editedFiles,
                        {
                            type: type,
                            path: id ? `simpledocs/files/${id}.json` : null,
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
                }));
            },
            addEditedFolder: (id, type, ogContent, modifiedContent, name) => {
                set((state) => ({
                    ...state,
                    editedFolder: [
                        {
                            type: type,
                            path: id? `simpledocs/files/${id}.json` : null,
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
            name: 'project-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // using sessionStorage; default is localStorage
        }
    )
);

export default useEditChangesStore;
