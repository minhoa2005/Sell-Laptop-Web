import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const userContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const updateUser = (data) => {
        setUser(prev => ({ ...prev, ...data }));
        sessionStorage.setItem('user', JSON.stringify({ ...user, ...data }));
    }

    const value = { user, setUser, loading, updateUser };
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