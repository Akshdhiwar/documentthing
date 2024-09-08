
import { create } from "zustand"
import { persist, createJSONStorage } from 'zustand/middleware'

type UserStoreType = {
    user: UserInterface | null;
    setUserData: (data: UserInterface) => void;
};

// Create the Zustand store with persistence
const useUserStore = create<UserStoreType>()(
    persist(
        (set) => ({
            user: null,
            setUserData: (data: UserInterface) => {
                set({ user: data });
            },
        }),
        {
            name: 'user-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // default is localStorage; using sessionStorage here
        }
    )
);

export default useUserStore;