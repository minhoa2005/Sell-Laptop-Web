import React, { useContext, useEffect, useState } from 'react'
import { userContext } from '../../UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../Layout/Header';

export default function MyOrder() {
    const { user, loading } = useContext(userContext);
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [current, setCurrent] = useState('pending');
    const fetchOrder = async () => {
        const response = await axios.get(`http://localhost:9999/order?userId=${user?.id}`);
        const query = response.data.map((item) => item.productId).join('&id=');
        const responseProduct = await axios.get(`http://localhost:9999/products?id=${query}`);
        const dataNew = response.data.map((item) => {
            const prod = responseProduct.data.find(p => p.id === item.productId);
            return {
                ...item,
                product: prod
            }
        });
        console.log(dataNew);
        setData(dataNew);
    };
    const handleCancelOrder = async (orderId) => {
        await axios.patch(`http://localhost:9999/products/${data.find(item => item.id === orderId).productId}`, {
            quantity: data.find(item => item.id === orderId).product.quantity + data.find(item => item.id === orderId).quantity
        });
        await axios.patch(`http://localhost:9999/order/${orderId}`, { orderStatus: 'canceled' });
        fetchOrder();
        alert('Đơn hàng đã được hủy');
    };
    const handleReceivedOrder = async (orderId) => {
        await axios.patch(`http://localhost:9999/order/${orderId}`, { orderStatus: 'delivered', cancelReason: 'Khách hàng hủy' });
        fetchOrder();
    };
    useEffect(() => {
        if (loading) return;
        if (!user) {
            alert('Vui lòng đăng nhập để tiếp tục');
            navigate('/login');
            return;
        }
        if (user?.role !== 1) {
            alert('Bạn không có quyền truy cập');
            navigate('/login');
            return;
        }
        fetchOrder();
        console.log(data);
    }, [loading, user]);
    return (
        <div>
            <Header />

            <div className="container-fluid p-3">
                <h1 >Đơn hàng của tôi</h1>
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
                                    <h3>Mã đơn hàng: {item.id}</h3>
                                    {(item.orderStatus === 'canceled' && item.cancelReason) && (
                                        <div className='alert alert-danger'>{item.cancelReason}</div>
                                    )}
                                    <hr />
                                    <div className='d-flex justify-content-between align-items-start'>
                                        <div>
                                            <img src={item.product?.image} alt={item.product?.name} className="img-fluid rounded shadow-sm border" style={{ maxHeight: '200px' }} />
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
                                                <p className='mb-0'><span className='fw-bold '>Tổng tiền:</span> {(item.price * item.quantity).toLocaleString()} VNĐ</p>
                                            </div>
                                            <div className='d-flex justify-content-end gap-3 mt-3'>
                                                <button className='btn btn-primary' onClick={() => navigate(`/product/${item.product?.id}`)}>Xem Chi Tiết</button>
                                                {item.orderStatus === 'shipping' ? (

                                                    <div>
                                                        <button className='btn btn-danger'
                                                            onClick={() => handleReceivedOrder(item.id)}>
                                                            Đã nhận hàng
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button className='btn btn-danger'
                                                        onClick={() => { item.orderStatus === 'canceled' || item.orderStatus === 'delivered' ? navigate(`/order/${item?.product?.id}`) : handleCancelOrder(item.id) }}>
                                                        {item.orderStatus === 'canceled' || item.orderStatus === 'delivered' ? 'Đặt lại' : 'Hủy Đơn'}
                                                    </button>
                                                )}
                                            </div>
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
