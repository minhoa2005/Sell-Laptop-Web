import React, { Children, use, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userContext } from '../UserContext';

export default function Header() {
    const [current, setCurrent] = useState();
    const navigate = useNavigate();
    const { user, setUser, loading } = useContext(userContext);
    // useEffect(() => {
    //     if (loading) return;
    //     if (!user) {
    //         navigate('/login');
    //         return;
    //     }
    //     if (user?.role === 1) {
    //         setCurrent('home');
    //     }
    //     else if (user?.role === 2) {
    //         setCurrent('orderList');
    //     }
    //     else if (user?.role === 3) {
    //         setCurrent('dashboard');
    //     }
    // }, [user, loading]);
    const handleLogout = () => {
        setUser(null);
        sessionStorage.removeItem('user');
        alert('Đăng xuất thành công');
        navigate('/login');
    }
    return (
        <div>
            <div className='d-flex gap-3 align-items-center bg-light p-2'>

                {user?.role === 1 && (
                    <>
                        <p className='fs-3 mb-0' style={{ cursor: 'pointer' }} onClick={() => { setCurrent('home'); navigate('/home') }}>Trang Chủ</p>
                        <p className={`fs-5 mb-0 ${current === 'myOrder' ? '' : 'text-muted'}`} style={{ cursor: 'pointer' }} onClick={() => { setCurrent('myOrder'); navigate('/my-order') }}>Đơn Hàng Của Tôi</p>
                        {/* <p className={`fs-5 mb-0 ${current === 'myCart' ? '' : 'text-muted'}`} style={{ cursor: 'pointer' }} onClick={() => { setCurrent('myCart') }}>Giỏ Hàng Của Tôi</p> */}

                    </>
                )}
                {user?.role === 2 && (
                    <>
                        <p className={`fs-3 mb-0 }`} style={{ cursor: 'pointer' }} onClick={() => { setCurrent('orderList'); navigate('/sale/order-list') }}>Danh Sách Đơn Hàng</p>
                        <p className={`fs-5 mb-0 ${current === 'productList' ? '' : 'text-muted'}`} style={{ cursor: 'pointer' }} onClick={() => { setCurrent('productList'); navigate('/sale/product-list'); console.log('Product List Clicked') }}>Danh Sách Sản Phẩm</p>
                    </>
                )}
                {user?.role === 3 && (
                    <>
                        <p className={`fs-3 mb-0 ${current === 'dashboard' ? '' : 'text-muted'}`} style={{ cursor: 'pointer' }} onClick={() => { setCurrent('dashboard'); navigate('/manager/dashboard') }}>Dashboard</p>
                        <p className={`fs-5 mb-0 ${current === 'userList' ? '' : 'text-muted'}`} style={{ cursor: 'pointer' }} onClick={() => { setCurrent('userList'); navigate('/manager/staff-manage') }}>Danh Sách Nhân Viên</p>
                        <p className={`fs-5 mb-0 ${current === 'roleList' ? '' : 'text-muted'}`} style={{ cursor: 'pointer' }} onClick={() => { setCurrent('roleList'); navigate('/manager/product-manage') }}>Danh Sách Sản Phẩm</p>
                        <p className={`fs-5 mb-0 ${current === 'orderManage' ? '' : 'text-muted'}`} style={{ cursor: 'pointer' }} onClick={() => { setCurrent('orderManage'); navigate('/manager/order-manage') }}>Quản Lý Đơn Hàng</p>
                    </>
                )}
                <div>
                    {user ? (
                        <>
                            <p className=' dropdown-toggle fs-5 mb-0 text-muted' style={{ cursor: 'pointer' }} data-bs-toggle="dropdown" aria-expanded="false">
                                Tài Khoản
                            </p>
                            <ul className='dropdown-menu'>
                                <li>
                                    <a className='dropdown-item' href='/personal-info'>Thông Tin Cá Nhân</a>
                                    <p className='dropdown-item mb-0' onClick={handleLogout} style={{ cursor: 'pointer' }}>Đăng Xuất</p>
                                </li>
                            </ul>
                        </>
                    ) : (
                        <div className='d-flex gap-3'>
                            <a className='fs-5 text-decoration-none text-black' href='/login'>Đăng Nhập</a>
                            <a className='fs-5 text-decoration-none text-black' href='/register'>Đăng Ký</a>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}
