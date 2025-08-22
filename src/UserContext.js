import React, { createContext, useEffect, useState } from 'react';

export const userContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const value = { user, setUser };
    useEffect(() => {
        const checkUser = sessionStorage.getItem('user');
        if (checkUser) {
            setUser(JSON.parse(checkUser));
        }
    }, []);

    return <userContext.Provider value={value}>{children}</userContext.Provider>
}