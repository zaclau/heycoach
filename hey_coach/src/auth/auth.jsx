import React, { createContext, useContext } from 'react';

const AuthContext = createContext();

export const useAuthContext = () => {
    return useContext(AuthContext);
}

export const AuthContextProvider = ({ children }) => {
    return <AuthContext.Provider
}