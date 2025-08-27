import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import Header from '../../Layout/Header';
import { userContext } from '../../UserContext';

export default function OrderManage() {
    const [orders, setOrders] = useState([]);
    const { user } = useContext(userContext);
    const [viewDetail, setViewDetail] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState({});
    const [cancelOrder, setCancelOrder] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [search, setSearch] = useState('');
    const [statusFilter, setFilter] = useState('');
    const [orderId, setOrderId] = useState();
    const fetchOrders = async () => {
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
        setOrders(dataNew);
    };
    const handleCancelOrder = async (orderId) => {
        console.log(orderId, cancelReason);
        if (!cancelReason) {
            alert('Vui lòng nhập lý do hủy đơn hàng');
            return;
        }
        await axios.patch(`http://localhost:9999/order/${orderId}`, { orderStatus: 'canceled', updatedBy: user.email, cancelReason });
        alert('Hủy đơn hàng thành công');
        fetchOrders();
    };
    const getDetail = (id) => {
        const detail = orders.find(o => o.id === id);
        setSelectedOrder(detail);
        setViewDetail(true);
    };
    const filter = () => {
        return orders.filter(o => {
            const matchSearch = o.id.toString().includes(search) || o.customer.name.toLowerCase().includes(search.toLowerCase()) || o.product.name.toLowerCase().includes(search.toLowerCase());
            const matchFilter = statusFilter ? o.orderStatus === statusFilter : true;
            return matchSearch && matchFilter;
        });
    }
    useEffect(() => {
        fetchOrders();
    }, [])
    return (
        <div>
            <Header />
            <div className='p-3'>
                <h1>Quản lý đơn hàng</h1>
                <div className='d-flex gap-3 mb-3'>
                    <input type="text" placeholder='Tìm kiếm...' className='form-control' onChange={(e) => setSearch(e.target.value)} />
                    <select className='form-select' onChange={(e) => setFilter(e.target.value)}>
                        <option value="">Tất cả</option>
                        <option value="pending">Đang chờ xử lý</option>
                        <option value="delivered">Đã giao</option>
                        <option value="canceled">Đã hủy</option>
                    </select>
                </div>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Mã Đơn</th>
                            <th>Tên Khách Hàng</th>
                            <th>Tên Sản Phẩm</th>
                            <th>Số Lượng</th>
                            <th>Giá</th>
                            <th>Trạng Thái</th>
                            <th>Người Xử Lý</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filter().map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.customer.name}</td>
                                <td>{order.product.name}</td>
                                <td>{order.quantity}</td>
                                <td>{order.price.toLocaleString('vi-VN')} VNĐ</td>
                                <td>{order.orderStatus}</td>
                                <td>{order.processBy || 'Chưa xử lý hoặc khách hàng đã hủy'}</td>
                                <td>
                                    <div className='d-flex gap-3 justify-content-start'>
                                        <button className='btn btn-primary' onClick={() => { getDetail(order.id) }}>Xem</button>
                                        {order.orderStatus !== 'canceled' && order.orderStatus !== 'delivered' && <button className='btn btn-danger' onClick={() => { setCancelOrder(true); setOrderId(order.id); }}>Hủy</button>}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {viewDetail && (
                <div className='modal fade show' style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className='modal-dialog modal-lg modal-dialog-scrollable'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h5 className='modal-title'>Chi tiết đơn hàng</h5>
                                <button type='button' className='btn-close' onClick={() => setViewDetail(false)}></button>
                            </div>
                            <div className='modal-body'>
                                <h6>Mã Đơn: {selectedOrder.id}</h6>
                                <p><span className='fw-bold'>Tên Khách Hàng:</span> {selectedOrder.customer?.name}</p>
                                <p><span className='fw-bold'>Tên Sản Phẩm:</span> {selectedOrder.product?.name}</p>
                                <p><span className='fw-bold'>Người Xử Lý:</span> {selectedOrder.processBy || 'Chưa xử lý hoặc khách hàng đã hủy'}</p>
                                <label htmlFor="quantity" className='fw-bold'>Số Lượng:</label>
                                <input type="number" className='form-control' disabled={selectedOrder.orderStatus === 'canceled'} id="quantity" value={selectedOrder.quantity} onChange={(e) => setSelectedOrder({ ...selectedOrder, quantity: e.target.value })} />
                                <p><span className='fw-bold'>Giá:</span> {selectedOrder.price?.toLocaleString('vi-VN')} VNĐ</p>
                                <select className="form-select" value={selectedOrder.orderStatus} disabled={selectedOrder.orderStatus === 'canceled'} onChange={(e) => setSelectedOrder({ ...selectedOrder, orderStatus: e.target.value })}>
                                    <option value="pending">Đang chờ</option>
                                    <option value="shipping">Đang vận chuyển</option>
                                    <option value="delivered">Đã giao hàng</option>
                                    {selectedOrder.orderStatus === 'canceled' && (
                                        <option value="canceled">Đã hủy</option>
                                    )}
                                </select>
                            </div>
                            <div className='modal-footer'>
                                <button className='btn btn-primary'>Lưu</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {cancelOrder && (
                <div className='modal fade show' style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className='modal-dialog modal-lg modal-dialog-scrollable'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h5 className='modal-title'>Hủy Đơn Hàng</h5>
                                <button type='button' className='btn-close' onClick={() => setCancelOrder(false)}></button>
                            </div>
                            <div className='modal-body'>
                                <p>Lý do hủy:</p>
                                <textarea className='form-control' rows='3' value={cancelReason} onChange={(e) => setCancelReason(e.target.value)}></textarea>
                            </div>
                            <div className='modal-footer'>
                                <button className='btn btn-danger' onClick={() => handleCancelOrder(orderId)}>Hủy Đơn</button>
                                <button className='btn btn-secondary' onClick={() => setCancelOrder(false)}>Đóng</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
