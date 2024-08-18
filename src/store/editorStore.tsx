import { create } from "zustand";

type editorStoreType = {
    editor : any,
    setEditor : (data : any) => void
}

const useEditorStore = create<editorStoreType>((set)=>({
    editor : null,
    setEditor : (data) => {
        set(()=>({
            editor :data 
        }))
    }
}))

export default useEditorStore