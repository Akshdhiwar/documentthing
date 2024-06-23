import { createContext } from "react";

interface foldercontextProps {
    folder : any
    createPage : (name : string) => void
    addPage : (name : string , id : string) => void
}


export const FolderContext = createContext<foldercontextProps | null>(null)