import { createContext, Dispatch } from "react";

interface EditorContextProps {
    editor : any
    setEditor : Dispatch<any>
}

export const EditorContext = createContext<EditorContextProps | null>(null)