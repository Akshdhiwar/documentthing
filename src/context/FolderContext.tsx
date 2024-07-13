import { createContext, Dispatch } from "react";

interface foldercontextProps {
    folder : any
    createPage : (name : string) => void
    addPage : (name : string , id : string) => void
    selected : any
    setSelected : Dispatch<any>
    setFolder : Dispatch<any>
}


export const FolderContext = createContext<foldercontextProps | null>(null)