import { createContext } from "react";

interface User {
    user : any;
    setUserData : (data: any)=> void;
}

export const UserContext = createContext<User | null>(null)

