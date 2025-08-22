import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:9999/user'

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const handleSubmit = async () => {
        const hasError = {};
        try {
            if (password !== confirmPassword) {
                hasError.confirmPassword = "Mật Khẩu Không Khớp";
            }
            else if (!email) {
                hasError.email = "Bắt buộc phải có email";
            }
            else if (!password) {
                hasError.password = "Bắt buộc phải có mật khẩu";
            }
            else if (!confirmPassword) {
                hasError.confirmPassword = "Bắt buộc phải có xác nhận mật khẩu";
            }
            if (hasError.email || hasError.password || hasError.confirmPassword) {
                setError(hasError);
                return;
            }
            const checkUser = await axios.get(`${API}?email=${email}`);
            if (checkUser.data.length > 0) {
                setError((prev) => ({ ...prev, email: "Email đã được sử dụng" }));
                return;
            }
            const userData = {
                email,
                password,
                personalInfo: {},
                address: {},
                role: 1
            }
            await axios.post(API, userData);
            alert("Đăng ký thành công");
            navigate('/login');
        } catch (error) {
            console.error("Registration failed:", error);
        }
    }
    return (
        <div className=' container-fluid d-flex justify-content-center align-items-center' style={{ minHeight: '100vh' }}>
            <div className='w-100 d-flex justify-content-center align-items-center'>
                <div className='bg-light p-5 rounded-3 shadow w-50'>
                    <h1 className='text-center'>Đăng ký</h1>
                    <div className="mb-3">
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label fw-bold">Email</label>
                            <input type="email" className="form-control form-control-lg" id="email" required placeholder='Nhập email của bạn' onChange={(e) => setEmail(e.target.value)} />
                            {error.email && <div className="text-danger">{error.email}</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label fw-bold">Mật khẩu</label>
                            <input type="password" className="form-control form-control-lg" id="password" required placeholder='Nhập mật khẩu của bạn' onChange={(e) => setPassword(e.target.value)} />
                            {error.password && <div className="text-danger">{error.password}</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label fw-bold">Xác nhận mật khẩu</label>
                            <input type="password" className="form-control form-control-lg " id="confirmPassword" required placeholder='Xác nhận mật khẩu của bạn' onChange={(e) => setConfirmPassword(e.target.value)} />
                            {error.confirmPassword && <div className="text-danger">{error.confirmPassword}</div>}
                        </div>
                        <div className='d-flex flex-column justify-content-center align-items-center'>
                            <button type="button" className="btn btn-primary py-3 w-100" onClick={handleSubmit}>Đăng ký</button>
                            <p className='mt-3'>Bạn đã có tài khoản? <a href="/login">Đăng nhập</a></p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
