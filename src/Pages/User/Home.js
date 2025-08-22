import React, { useContext, useEffect } from 'react'
import { userContext } from '../../UserContext'
import { useNavigate } from 'react-router-dom';
import Header from '../../Layout/Header';

export default function Home() {
    const user = useContext(userContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    })
    return (
        <div>
            <Header />
        </div>
    )
}
