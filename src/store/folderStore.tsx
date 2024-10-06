// import axiosInstance from "@/shared/axios intercepter/axioshandler";
import { create } from "zustand";
// import useProjectStore from "./projectStore";
import useDoublyLinkedListStore from "./nextPreviousLinks";
import useEditChangesStore from "./changes";

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
    isNoFilePresent: boolean,
    setIsNoFilePresent: (val: boolean) => void
    originalFolder: Folder[],
}

// Define the store
const useFolderStore = create<folderStoreType>((set) => ({
    folder: [],
    originalFolder: [],
    setFolder: (content: Folder[] | []) => {

        if (content.length === 0) {
            set((state) => ({
                ...state,
                isNoFilePresent: true
            }))
        }

        if (content.length > 0 && useFolderStore.getState().isNoFilePresent) {
            set((state) => ({
                ...state,
                isNoFilePresent: false
            }))
        }
        
        set((state) => ({
            ...state,
            folder: content,
            originalFolder: [...content],
            selectedFolder: content[0]
        }))
    },
    createPage: async (name: string) => {
        set((state) => ({
            ...state,
            loading: true
        }))
        const newFolder: Folder = {
            id: crypto.randomUUID(),
            name: name,
            children: [],
        };

        // Simulate saving folder structure (replace with your actual function)
        let updatedFolder = saveFolderStructure(newFolder);

        // Update the state with the new folder
        set((state) => ({
            ...state,
            folder: updatedFolder,
            loading: false,
            isNoFilePresent: false
        }));
    },
    addPage: async (name: string, id: string) => {
        try {
            set((state) => ({ ...state, loading: true }));

            let obj: Folder = {
                id: crypto.randomUUID(),
                name: name,
                children: []
            };

            const updatedFolder = saveFolderStructure(obj, id);

            set((state) => ({
                ...state,
                folder: updatedFolder,
                loading: false
            }));
        } catch (error) {
            console.error("Failed to add page:", error);
            set((state) => ({ ...state, loading: false }));
        }
    },

    selectedFolder: null,
    setSelectedFolder: (folder: Folder) => {
        set((state) => ({
            ...state,
            selectedFolder: folder,
            Url: getUrlFromFolder(folder, useFolderStore.getState().folder)
        }))
    },
    Url: "",
    loading: false,
    setLoading: (value: boolean) => {
        set((state) => ({
            ...state,
            loading: value,
        }))
    },
    isNoFilePresent: false,
    setIsNoFilePresent: (value: boolean) => set(state => ({ ...state, isNoFilePresent: value })),
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
function saveFolderStructure(folder: Folder, parentID?: string) {

    // const project = useProjectStore.getState().project; // Access project dynamically

    // const response : any = await axiosInstance.post(`/folder/update`, {
    //     // folder_object: btoa(JSON.stringify(folderStructure)),
    //     id: project?.Id,
    //     folder : folder,
    //     parentID : parentID ? parentID : "",
    // })

    // useDoublyLinkedListStore.getState().clearList();
    // useDoublyLinkedListStore.getState().convertIntoLinkedList(response.data)
    // return response.data

    let changesStore = useEditChangesStore.getState()
    const originalFolder = useFolderStore.getState().originalFolder;
    const url = useFolderStore.getState().Url;


    const isFolderPresentInEditedFolderArray = changesStore.editedFiles.some(file => {
        return file.type === "folder"
    })

    if (parentID) {
        let updatedFolder = recursivelyAddFileInNestedFolder(originalFolder, folder, parentID)

        if (isFolderPresentInEditedFolderArray) {
            let folderStructure = changesStore.editedFolder
            folderStructure.forEach(file => {
                if (file.type === "folder") {
                    file.changedContent = JSON.stringify(updatedFolder)
                }
            })
            useEditChangesStore.setState((state) => {
                return {
                    ...state,
                    editedFolder: [...folderStructure]
                }
            })
            changesStore.addEditedFile(folder.id, "file", "",  JSON.stringify([{
                children: [],
                content: [],
                id: "7af2d8c4-d4b1-480c-b833-be99737a340f",
                props: {
                    textColor: "default",
                    backgroundColor: "default",
                    textAlignment: "left"
                },
                type: "paragraph"
            }]), folder.name)
            changesStore.addEditedMarkdown( folder.id ,  "markdown", null , null ,null , url.replace(/\s/g, '') + "/" + folder.name + ".md")
        } else {
            changesStore.addEditedFolder(null, "folder", JSON.stringify(useFolderStore.getState().originalFolder), JSON.stringify(updatedFolder), null)
            changesStore.addEditedFile(folder.id, "file", "", [{
                children: [],
                content: [],
                id: "7af2d8c4-d4b1-480c-b833-be99737a340f",
                props: {
                    textColor: "default",
                    backgroundColor: "default",
                    textAlignment: "left"
                },
                type: "paragraph"
            }], folder.name)
            changesStore.addEditedMarkdown(folder.id ,"markdown" , null , null , null , url.replace(/\s/g, '') + "/" + folder.name + ".md")
        }

    } else {
        if (isFolderPresentInEditedFolderArray) {
            let folderStructure = changesStore.editedFiles
            folderStructure.forEach(file => {
                if (file.type === "folder") {
                    file.changedContent = JSON.stringify([...JSON.parse(file.changedContent!), folder])
                }
            })
            changesStore.setEditedFolder([...folderStructure])
            changesStore.addEditedFile(folder.id, "file", "", [{
                children: [],
                content: [],
                id: "7af2d8c4-d4b1-480c-b833-be99737a340f",
                props: {
                    textColor: "default",
                    backgroundColor: "default",
                    textAlignment: "left"
                },
                type: "paragraph"
            }], folder.name)
            changesStore.addEditedMarkdown(folder.id ,"markdown" , null , null, null , folder.name + ".md")
        } else {
            originalFolder.push(folder)
            changesStore.addEditedFolder(null, "folder", JSON.stringify(useFolderStore.getState().originalFolder), JSON.stringify(originalFolder), null)
            changesStore.addEditedFile(folder.id, "file", "", [{
                children: [],
                content: [],
                id: "7af2d8c4-d4b1-480c-b833-be99737a340f",
                props: {
                    textColor: "default",
                    backgroundColor: "default",
                    textAlignment: "left"
                },
                type: "paragraph"
            }], folder.name)
            changesStore.addEditedMarkdown(folder.id ,"markdown" , null , null , null , folder.name + ".md")
        }
    }

    useDoublyLinkedListStore.getState().clearList();
    useDoublyLinkedListStore.getState().convertIntoLinkedList(originalFolder)

    return originalFolder

}

function recursivelyAddFileInNestedFolder(folder: Folder[], file: Folder, parentId: string) {
    for (let i = 0; i < folder.length; i++) {
        if (folder[i].id === parentId) {
            folder[i].children.push(file)
            return folder
        }
        if (folder[i].children.length > 0) {
            folder[i].children = recursivelyAddFileInNestedFolder(folder[i].children, file, parentId)
        }
    }
    return folder;
}