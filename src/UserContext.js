import React, { createContext, useEffect, useState } from 'react';

export const userContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const value = { user, setUser, loading };
    useEffect(() => {
        const checkUser = sessionStorage.getItem('user');
        if (checkUser) {
            setUser(JSON.parse(checkUser));
        }
        console.log(checkUser)
        setLoading(false);
    }, []);

    return <userContext.Provider value={value}>{children}</userContext.Provider>
}