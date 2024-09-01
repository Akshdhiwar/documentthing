
import useUserStore from "@/store/userStore";
import React, { useState } from "react";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const data = useUserStore(state => state.user)
    const [user] = useState(data)

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
