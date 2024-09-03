import axiosInstance from "@/shared/axios intercepter/axioshandler";
import { create } from "zustand";
import useProjectStore from "./projectStore";
import useDoublyLinkedListStore from "./nextPreviousLinks";

type folderStoreType = {
    folder: Folder[]
    setFolder: (content: Folder[] | []) => void
    createPage: (name: string) => Promise<void>
    addPage: (name: string, id: string) => Promise<void>
    selectedFolder: Folder | null;
    setSelectedFolder: (folder: Folder) => void,
    Url: string,
    loading: boolean,
    setLoading: (val: boolean) => void,
    isNoFilePresent : boolean,
    setIsNoFilePresent : (val : boolean) => void
}

// Define the store
const useFolderStore = create<folderStoreType>((set) => ({
    folder: [],
    setFolder: (content: Folder[] | []) => {

        if(content.length === 0){
            set(()=>({
                isNoFilePresent : true
            }))
        }

        if(content.length > 0 && useFolderStore.getState().isNoFilePresent){
            set(()=>({
                isNoFilePresent : false
            }))
        }

        if(content.length === 1 && content[0].children.length ===0){
            set(()=>({
                selectedFolder : content[0]
            }))
        }

        set(() => ({
            folder: content
        }))
    },
    createPage: async (name: string) => {
        set(() => ({
            loading: true
        }))
        const newFolder: Folder = {
            id: crypto.randomUUID(),
            name: name,
            children: [],
        };

        // Simulate saving folder structure (replace with your actual function)
        await saveFolderStructure(newFolder);

        // Update the state with the new folder
        set((state) => ({
            folder: [...state.folder, newFolder],
            loading: false,
            isNoFilePresent : false
        }));
    },
    addPage: async (name: string, id: string) => {
        try {
            set({ loading: true });
    
            let obj: Folder = {
                id: crypto.randomUUID(),
                name: name,
                children: []
            };
    
            const updatedFolder = await saveFolderStructure(obj, id);
    
            set({
                folder: updatedFolder,
                loading: false
            });
        } catch (error) {
            console.error("Failed to add page:", error);
            set({ loading: false });
        }
    },
    
    selectedFolder: null,
    setSelectedFolder: (folder: Folder) => {
        set(() => ({
            selectedFolder: folder,
            Url: getUrlFromFolder(folder, useFolderStore.getState().folder)
        }))
    },
    Url: "",
    loading: false,
    setLoading: (value: boolean) => {
        set({
            loading: value,
        })
    },
    isNoFilePresent : false,
    setIsNoFilePresent: (value: boolean) => set({ isNoFilePresent: value }),
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
async function saveFolderStructure(folder: Folder , parentID? : string) {

    const project = useProjectStore.getState().project; // Access project dynamically

    const response : any = await axiosInstance.post(`/folder/update`, {
        // folder_object: btoa(JSON.stringify(folderStructure)),
        id: project?.Id,
        folder : folder,
        parentID : parentID ? parentID : "",
    })

    useDoublyLinkedListStore.getState().clearList();
    useDoublyLinkedListStore.getState().convertIntoLinkedList(response.data)
    return response.data
}