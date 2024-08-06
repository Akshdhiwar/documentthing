
import { useSessionStorage } from "@/shared/custom hooks/useSessionStorage";
import React, { useState } from "react";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const {getItem} = useSessionStorage("user")
    const [user] = useState(getItem)

    return user ? <>{children}</> : <Unauthorized />;
};

export default ProtectedRoute;

const Unauthorized: React.FC = () => {
    return (
        <div className='h-screen flex items-center justify-center'>
            Unauthorized
        </div>
    );
};
