import { create } from "zustand";

type editorStoreType = {
    isEditing : boolean
    setIsEditing : (data : boolean) => void
}

const useEditChangesStore = create<editorStoreType>((set)=>({
    isEditing : false,
    setIsEditing : (data : boolean) => {
        set(()=>({
            isEditing : data
        }))
    }
 
}))

export default useEditChangesStore