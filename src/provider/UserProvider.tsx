import { UserContext } from '@/context/UserContext'
import React, { useState } from 'react'

interface UserProviderInterface {
    children: React.ReactNode
}

const UserProvider: React.FC<UserProviderInterface> = ({ children }) => {

    const [user , setUser] = useState<any | undefined>(undefined)

    const setUserData = (data : any | undefined)=>{
        setUser(data)
    }

    return (
        <UserContext.Provider value={{user , setUserData}}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider