
import { create } from "zustand"

type BranchStoreType = {
    name: string
    setName: (name: string) => void
};

// Create the Zustand store with persistence
const useBranchStore = create<BranchStoreType>()(
    (set) => ({
        name: "",
        setName: (name: string) => set({ name: name })
    })
);

export default useBranchStore;