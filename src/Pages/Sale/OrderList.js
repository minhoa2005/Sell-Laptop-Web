import React, { useContext, useEffect, useState } from 'react'
import Header from '../../Layout/Header'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { userContext } from '../../UserContext';

export default function OrderList() {
    const navigate = useNavigate();
    const { user, loading } = useContext(userContext);
    const [current, setCurrent] = useState('pending');
    const [data, setData] = useState([]);
    const fetchOrder = async () => {
        const response = await axios.get(`http://localhost:9999/order`);
        const query = response.data.map((item) => item.productId).join('&id=');
        const responseProduct = await axios.get(`http://localhost:9999/products?id=${query}`);
        const userQuery = response.data.map((order) => order.userId).join('&id=');
        const responseUser = await axios.get(`http://localhost:9999/user?id=${userQuery}`);
        const dataNew = response.data.map((item) => {
            const prod = responseProduct.data.find(p => p.id === item.productId);
            const customer = responseUser.data.find(u => u.id === item.userId);
            return {
                ...item,
                product: prod,
                customer: {
                    name: customer?.personalInfo?.name,
                    email: customer?.email,
                }
            }
        });
        console.log(dataNew);
        setData(dataNew);
    };
    const handleUpdateStatus = async (orderId) => {
        await axios.patch(`http://localhost:9999/order/${orderId}`, { orderStatus: 'shipping', updatedBy: user.email });
        fetchOrder();
    };
    useEffect(() => {
        if (!loading) {
            return;
        }
        if (!user) {
            navigate('/login');
            return;
        }
        if (user.role !== 2) {
            alert('Bạn không có quyền truy cập');
            navigate('/login');
            return;
        }
        fetchOrder();
    }, [loading, user]);
    return (
        <div>
            <Header />
            <h1 >Đơn hàng</h1>
            <div className="container-fluid">
                <div className='d-flex justify-content-center'>
                    <div className='btn-group' role='group'>
                        <button type='button' className={`btn ${current === 'pending' ? 'btn-outline-primary' : 'btn-primary'}`} onClick={() => setCurrent('pending')}>Đang Chuẩn Bị Hàng</button>
                        <button type='button' className={`btn ${current === 'shipping' ? 'btn-outline-primary' : 'btn-primary'}`} onClick={() => setCurrent('shipping')}>Đang Giao Hàng</button>
                        <button type='button' className={`btn ${current === 'delivered' ? 'btn-outline-primary' : 'btn-primary'}`} onClick={() => setCurrent('delivered')}>Đã Giao Hàng</button>
                        <button type='button' className={`btn ${current === 'canceled' ? 'btn-outline-primary' : 'btn-primary'}`} onClick={() => setCurrent('canceled')}>Đã Hủy</button>
                    </div>
                </div>
                <hr />
                <div className='d-flex flex-column gap-5'>
                    {data.map(item => {
                        console.log(item.orderStatus, current);
                        if (item.orderStatus === current) {
                            return (
                                <div className='border shadow-sm rounded p-3'>
                                    <div>
                                        <h3>Đơn hàng: {item.id}</h3>
                                        <p>Ngày đặt hàng: {item.date.split(' ').join(', ')}</p>
                                    </div>
                                    <hr />
                                    <div className='d-flex justify-content-between align-items-start'>
                                        <div>
                                            <img src={`/${item.product?.image}`} alt={item.product?.name} className="img-fluid   rounded shadow-sm border" />
                                        </div>
                                        <div className='d-flex flex-column justify-content-end text-end'>
                                            <div>
                                                <h5>{item.product?.name}</h5>
                                                <p>{item.product?.description}</p>
                                            </div>
                                            <div className='d-flex justify-content-end'>
                                                <p className='xmb-0'><span className='fw-bold '>Số lượng:</span> {item.quantity}</p>
                                            </div>
                                            <div className='d-flex justify-content-end'>
                                                <p className='xmb-0'><span className='fw-bold '>Tổng tiền:</span> {item.price.toLocaleString('vi-VN')} VNĐ</p>
                                            </div>
                                            <hr />
                                            <div>
                                                <p className='xmb-0'><span className='fw-bold '>Khách Hàng:</span> {item.customer?.name}</p>
                                                <p className='xmb-0'><span className='fw-bold '>Địa chỉ giao hàng:</span> {item.address}</p>
                                                <p className='xmb-0'><span className='fw-bold '>Số điện thoại:</span> {item.phone}</p>
                                            </div>
                                            {item.orderStatus === 'pending' && (
                                                <div className='d-flex justify-content-end gap-3 mt-3'>
                                                    <button className='btn btn-primary' onClick={() => handleUpdateStatus(item.id)} >Đang giao hàng</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            </div>
        </div >
    )
}
