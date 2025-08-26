import React, { Children, use, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userContext } from '../UserContext';

export default function Header() {
    const [current, setCurrent] = useState('home');
    const navigate = useNavigate();
    const { user, setUser, loading } = useContext(userContext);
    useEffect(() => {
        if (loading) return;
        if (!user) {
            navigate('/login');
        }
    }, [user, loading]);
    const handleLogout = () => {
        setUser(null);
        sessionStorage.removeItem('user');
        alert('Đăng xuất thành công');
        navigate('/login');
    }
    return (
        <div>
            <div className='d-flex gap-3 align-items-center bg-light p-2'>
                <p className='fs-3 mb-0' style={{ cursor: 'pointer' }} onClick={() => { setCurrent('home'); navigate('/home') }}>Trang Chủ</p>
                {user?.role === 1 && (
                    <>
                        <p className={`fs-5 mb-0 ${current === 'myOrder' ? '' : 'text-muted'}`} style={{ cursor: 'pointer' }} onClick={() => { setCurrent('myOrder'); navigate('/my-order') }}>Đơn Hàng Của Tôi</p>
                        {/* <p className={`fs-5 mb-0 ${current === 'myCart' ? '' : 'text-muted'}`} style={{ cursor: 'pointer' }} onClick={() => { setCurrent('myCart') }}>Giỏ Hàng Của Tôi</p> */}

                    </>
                )}
                {user?.role === 2 && (
                    <>
                        <p className={`fs-5 mb-0 ${current === 'orderList' ? '' : 'text-muted'}`} style={{ cursor: 'pointer' }} onClick={() => { setCurrent('orderList'); navigate('/sale/order-list') }}>Danh Sách Đơn Hàng</p>
                        <p className={`fs-5 mb-0 ${current === 'productList' ? '' : 'text-muted'}`} style={{ cursor: 'pointer' }} onClick={() => { setCurrent('productList'); navigate('/sale/product-list') }}>Danh Sách Sản Phẩm</p>
                    </>
                )}
                <div>
                    <p className=' dropdown-toggle fs-5 mb-0 text-muted' style={{ cursor: 'pointer' }} data-bs-toggle="dropdown" aria-expanded="false">
                        Tài Khoản
                    </p>
                    <ul className='dropdown-menu'>
                        <li>
                            <a className='dropdown-item' href='/sale/personal-info'>Thông Tin Cá Nhân</a>
                            <p className='dropdown-item mb-0' onClick={handleLogout} style={{ cursor: 'pointer' }}>Đăng Xuất</p>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
    )
}
