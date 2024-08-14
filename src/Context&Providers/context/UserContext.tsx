import { createContext } from "react";

interface User {
    user : UserInterface;
    setUserData : (data: any)=> void;
}

export const UserContext = createContext<User | null>(null)

