import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ProjectStoreType = {
    project: Project | null,
    setProject: (data: Project) => void
}

const useProjectStore = create<ProjectStoreType>()(
    persist(
        (set) => ({
            project: null,
            setProject: (data: Project) => {
                set({ project: data });
            },
        }),
        {
            name: 'project-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => sessionStorage), // using sessionStorage; default is localStorage
        }
    )
);

export default useProjectStore