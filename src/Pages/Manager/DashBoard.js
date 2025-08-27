import React, { useContext, useEffect, useState } from 'react'
import Header from '../../Layout/Header'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { userContext } from '../../UserContext';

export default function DashBoard() {
    const [data, setData] = useState([]);
    const [product, setProduct] = useState([]);
    const { user } = useContext(userContext);
    const navigate = useNavigate();
    const fetchData = async () => {
        const response = await axios.get('http://localhost:9999/order');
        const query = response.data.map((item) => item.productId).join('&id=');
        const responseProduct = await axios.get(`http://localhost:9999/products?id=${query}`);
        const userQuery = response.data.map((order) => order.userId).join('&id=');
        const responseUser = await axios.get(`http://localhost:9999/user?id=${userQuery}`);
        const getProduct = await axios.get('http://localhost:9999/products');
        const filterProduct = getProduct.data.filter(p => p.quantity <= 2);
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
        dataNew.sort((a, b) => a.orderStatus.localeCompare(b.orderStatus));
        setProduct(filterProduct);
        setData(dataNew);
    };
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (user.role !== 3) {
            alert('Bạn không có quyền truy cập');
            navigate('/login');
            return;
        }
        fetchData();
    }, []);
    return (
        <div className='container-fluid'>
            <Header />
            <br />
            <div className='d-flex justify-content-around'>
                <div className='border rounded shadow-sm p-3'>
                    <h2>Đơn hàng đã nhận</h2>
                    <div style={{ overflowX: 'auto', maxHeight: '300px' }}>
                        <table className='table table-striped'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Số lượng</th>
                                    <th>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className=''>
                                {data.map(order => (
                                    <tr key={order.id}>
                                        <td>{order.id}</td>
                                        <td>{order.product?.name}</td>
                                        <td>{order.quantity}</td>
                                        <td>{order.orderStatus === 'shipping' ?
                                            'Đang giao' : order.orderStatus === 'delivered' ?
                                                'Đã giao' : order.orderStatus === 'pending' ?
                                                    'Đơn mới' : 'Đã hủy'}</td>
                                    </tr>

                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className='border rounded shadow-sm p-3' st>
                    {/* <h2>Doanh thu</h2>
                    <hr />
                    
                    <div>
                        <p>Hôm nay: </p>
                        <p>Tuần này: </p>
                        <p>Tháng này: </p>
                    </div> */}
                    <h2>Sản phẩm cần lưu ý</h2>
                    <hr />
                    <div style={{ overflowX: 'auto', maxHeight: '300px' }}>
                        <table className='table table-striped'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Số lượng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {product.map(item => (
                                    <tr key={item.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/manager/product-manage`, { state: { id: item.id } })}>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div>
                    <h3>Nút Tắt</h3>
                    <div className='d-flex flex-column   gap-3'>
                        <button className='btn btn-primary' onClick={() => navigate(`/manager/product-manage`)}>
                            Danh sách sản phẩm
                        </button>
                        <button className='btn btn-primary' onClick={() => navigate(`/manager/staff-manage`)}>
                            Danh sách nhân viên
                        </button>
                    </div>
                </div>
            </div>

        </div >
    )
}
