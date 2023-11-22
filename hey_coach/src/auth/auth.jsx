import React, { createContext, useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuthContext = () => {
    return useContext(AuthContext);
}

export const AuthContextProvider = ({ children }) => {
    const [ loggedInUser, setLoggedInUser ] = useState(null);

    const signIn = (user) => {
        setLoggedInUser(user);
    }

    const signOut = () => {
        setLoggedInUser(null);
    }

    const userManagement = {
        userStore: loggedInUser,
        signInUser: signIn,
        signOutUser: signOut,
    }

    return <AuthContext.Provider value={ userManagement }>
        { children }
    </AuthContext.Provider>
}

export const AuthRequired = ({ children }) => {
    const auth = useAuthContext();
    if (auth && auth.userStore) {
        return children;
    }
    return <Navigate to="/login" />
}