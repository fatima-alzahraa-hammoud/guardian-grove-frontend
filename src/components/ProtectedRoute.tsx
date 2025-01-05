import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import React, { ReactElement } from 'react';

interface Token {
  userId: string;
}

interface ProtectedRouteProps {
    element: ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/" replace />;
    }

    try {
        const decoded: Token = jwtDecode(token);
        const userId = decoded.userId;

        return React.cloneElement(element, { userId });
    } catch (error) {
        return <Navigate to="/" replace />;
    }
};

export default ProtectedRoute;
