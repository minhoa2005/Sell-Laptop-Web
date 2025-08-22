import React, { useContext, useEffect, useState } from 'react'
import { userContext } from '../UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [error, setError] = useState({
        email: '',
        password: '',
        general: ''
    });
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { user, setUser } = useContext(userContext);
    const navigate = useNavigate();
    const handleLogin = async () => {
        try {
            const getUser = await axios.get(`http://localhost:9999/user?email=${email}&password=${password}`);
            if (getUser.data.length > 0) {
                setUser(getUser.data[0]);
                sessionStorage.setItem('user', JSON.stringify(getUser.data[0]));
                alert("Đăng nhập thành công");
                navigate('/home');
            } else {
                setError({ general: 'Email hoặc mật khẩu không đúng' });
            }
        } catch (error) {
            console.error("Đăng nhập thất bại:", error);
        }
    }
    useEffect(() => {
        if (user) {
            navigate('/home');
        }
    }, [user]);
    return (
        <div className=' container-fluid d-flex justify-content-center align-items-center' style={{ minHeight: '100vh' }}>
            <div className='w-100 d-flex justify-content-center align-items-center'>
                <div className='bg-light p-5 rounded-3 shadow w-50'>
                    <h1 className='text-center'>Đăng Nhập</h1>
                    {error.general && <div className="text-danger">{error.general}</div>}
                    <div className="mb-3">
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label fw-bold">Email</label>
                            <input type="email" className="form-control form-control-lg" id="email" required placeholder='Nhập email của bạn' onClick={(e) => setEmail(e.target.value)} />
                            {error.email && <div className="text-danger">{error.email}</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label fw-bold">Mật khẩu</label>
                            <input type="password" className="form-control form-control-lg" id="password" required placeholder='Nhập mật khẩu của bạn' onClick={(e) => setPassword(e.target.value)} />
                            {error.password && <div className="text-danger">{error.password}</div>}
                        </div>
                        <div className='d-flex flex-column justify-content-center align-items-center'>
                            <button type="button" className="btn btn-primary py-3 w-100" onClick={handleLogin}>Đăng Nhập</button>
                            <p className='mt-3'>Bạn chưa có tài khoản? <a href="/register">Đăng ký</a></p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
