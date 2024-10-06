import { create } from "zustand";

type editorStoreType = {
    editor : any,
    setEditor : (data : any) => void,
    content : any,
    setContent : (data : any) => void,
    initialContent : any,
    setInitialContent : (data : any) => void,
    markdown : any,
    setMarkdown : (data : any) => void
}

const useEditorStore = create<editorStoreType>((set)=>({
    editor : null,
    setEditor : (data) => {
        set(()=>({
            editor :data 
        }))
    },
    content : null,
    setContent : (data) => {
        set(()=>({
            content : data
        }))
    },
    initialContent : null,
    setInitialContent : (data) => {
        set(()=>({
            initialContent : data
        }))
    },
    markdown : null,
    setMarkdown : (data) => {
        set(()=>({
            markdown : data
        }))
    }
}))

export default useEditorStore