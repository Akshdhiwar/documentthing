import axiosInstance from "@/shared/axios intercepter/axioshandler";
import { create } from "zustand";
import useProjectStore from "./projectStore";

type folderStoreType = {
    folder: Folder[]
    setFolder: (content: Folder[] | []) => void
    createPage: (name: string) => Promise<void>
    addPage: (name: string, id: string) => Promise<void>
    selectedFolder: Folder | null;
    setSelectedFolder: (folder: Folder) => void,
    Url: string,
    loading : boolean,
    setLoading : (val : boolean) => void
}

// Define the store
const useFolderStore = create<folderStoreType>((set, get) => ({
    folder: [],
    setFolder: (content: Folder[] | []) => {
        set(() => ({
            folder: content
        }))
    },
    createPage: async (name: string) => {
        set(() => ({
            loading : true
        }))
        const newFolder: Folder = {
            id: crypto.randomUUID(),
            name: name,
            fileId: crypto.randomUUID(),
            children: [],
        };

        // Simulate saving folder structure (replace with your actual function)
        await saveFolderStructure([...get().folder, newFolder], newFolder.fileId);

        // Update the state with the new folder
        set((state) => ({
            folder: [...state.folder, newFolder],
            loading : false
        }));
    },
    addPage: async (name: string, id: string) => {
        set(() => ({
            loading : true
        }))
        let obj: Folder = {
            id: crypto.randomUUID(),
            name: name,
            fileId: crypto.randomUUID(),
            children: []
        }
        const updatedFolder = recursive(name, id, get().folder, obj);
        await saveFolderStructure(updatedFolder, obj.fileId)
        set(() => ({
            folder: updatedFolder,
            loading : false
        }))
    },
    selectedFolder: null,
    setSelectedFolder: (folder: Folder) => {
        set(() => ({
            selectedFolder: folder,
            Url: getUrlFromFolder(folder, useFolderStore.getState().folder)
        }))
    },
    Url: "",
    loading : false,
    setLoading : (value : boolean) => {
        set({
            loading : value,
        })
    }
}));

export default useFolderStore;

function getUrlFromFolder(selectedFolder: Folder, folder: Folder[]): string | undefined {

    for (const file of folder) {
        let urlName = file.name;

        // Check if the current folder is the selected one
        if (file.id === selectedFolder.id) {
            return urlName;
        }

        // If it has children, recursively look into them
        if (file.children.length > 0) {
            const childUrl = getUrlFromFolder(selectedFolder, file.children);
            if (childUrl) {
                return urlName + " / " + childUrl;
            }
        }
    }

    // Return undefined if no match found
    return undefined;
}
async function saveFolderStructure(folderStructure: any[], fileID: string) {

    const project = useProjectStore.getState().project; // Access project dynamically

    const response = await axiosInstance.post(`/folder/update`, {
        folder_object: btoa(JSON.stringify(folderStructure)),
        id: project?.Id,
        file_id: fileID,
    })
    return response.status
}

function recursive(name: any, id: any, folder: any, obj: any) {
    return folder.map((node: any) => {
        if (node.id === id) {
            return { ...node, children: [...node.children, obj] }
        } else if (node.children.length > 0 && node.id !== id) {
            return { ...node, children: recursive(name, id, node.children, obj) }
        }
        return node
    })
}