import React, { use, useContext, useEffect, useState } from 'react'
import Header from '../../Layout/Header'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { userContext } from '../../UserContext';

export default function Order() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, loading } = useContext(userContext);
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState();
    const [product, setProduct] = useState();
    const [formUserName, setFormUserName] = useState('');
    const [formUserAddress, setFormUserAddress] = useState('');
    const [formUserPhone, setFormUserPhone] = useState('');
    const [newAddress, setNewAddress] = useState('');
    const [saveAddress, setSaveAddress] = useState(false);
    const fetchProduct = async () => {
        const response = await axios.get(`http://localhost:9999/products/${id}`);
        const data = { ...response.data, price: response.data.price.split(".").join("") };
        console.log(response.data)
        setProduct(data);
    };
    const createOrder = async () => {
        if (!user) {
            alert("Vui lòng đăng nhập để đặt hàng");
            return;
        }
        if (!formUserAddress || !formUserPhone) {
            alert("Vui lòng điền đầy đủ thông tin địa chỉ và số điện thoại");
            return;
        }
        if (!product) {
            alert("Sản phẩm không hợp lệ");
            return;
        }
        if (saveAddress) {
            await axios.patch(`http://localhost:9999/user/${user.id}`, {
                address: user.address ? [...user.address, newAddress] : [newAddress]
            });
        }
        const order = {
            userId: user.id,
            productId: product.id,
            quantity,
            price,
            address: formUserAddress,
            phone: formUserPhone,
            date: new Date().toLocaleString('vi-VN'),
            orderStatus: "pending"
        };
        if (quantity > product.quantity) {
            alert("Số lượng đặt vượt quá số lượng trong kho");
            return;
        }
        if (product.quantity === 0) {
            alert("Sản phẩm đã hết hàng");
            return;
        }
        await axios.post('http://localhost:9999/order', order);
        await axios.patch(`http://localhost:9999/products/${product.id}`, { quantity: product.quantity - quantity });
        alert("Đặt hàng thành công. Bạn có thể theo dõi đơn hàng ở mục Đơn Hàng Của Tôi");
        navigate('/home');
    }
    useEffect(() => {
        if (loading) return;
        if (!user) {
            navigate('/login');
            return;
        }
        if (user.role !== 1) {
            alert("Bạn không có quyền truy cập");
            navigate('/login');
            return;
        }
        setFormUserAddress(user?.address[0] || '');
        setFormUserName(user?.personalInfo?.name || '');
        setFormUserPhone(user?.personalInfo?.phone || '');
        console.log(user);
        fetchProduct();
    }, [loading, user]);
    useEffect(() => {
        setPrice(quantity * product?.price);
    }, [quantity, product]);
    return (
        <div>
            <Header />

            <div className='container-fluid row'>
                <h1>Đặt Hàng</h1>
                <div className='col-7'>

                    <div className='d-flex flex-row gap-5 border p-4 shadow-sm rounded'>
                        <img src="/laptop1.png" alt="Product" className="img-fluid rounded shadow-sm border" />
                        <div>
                            <h4 className='text-primary'>{product?.name}</h4>
                            <p className='fw-bold mb-0'>Thông tin sản phẩm:</p>
                            <p>{product?.description}</p>
                            <hr />
                            <p className='fw-bold mb-0'>Chọn số lượng: </p>
                            <div className='d-flex align-items-center gap-3'>
                                <button className='btn btn-secondary' onClick={() => setQuantity(quantity - 1)} disabled={quantity === 1 || product?.quantity === 0}>
                                    -
                                </button>
                                <p className='mb-0'>{quantity}</p>
                                <button className='btn btn-secondary' onClick={() => setQuantity(quantity + 1)} disabled={product?.quantity === quantity || quantity === 5 || product?.quantity === 0}>
                                    +
                                </button>
                            </div>
                            {product?.quantity === quantity && <p className='text-danger'>Đã đạt số lượng tối đa</p>}
                            {product?.quantity === 0 && <p className='text-danger'>Sản phẩm đã hết hàng</p>}
                            <hr />
                            <p><span className='fw-bold'>Giá:</span> {price?.toLocaleString('vi-VN')} VNĐ</p>
                        </div>
                    </div>
                </div>
                <div className='col-5'>
                    {/* Thông tin địa chỉ */}
                    <div className='border p-4 shadow-sm rounded'>
                        <h3>Địa chỉ giao hàng</h3>
                        <hr />
                        <div>
                            <p className='mb-0'>Tên người nhận:</p>
                            <input className='form-control' value={formUserName} onChange={(e) => setFormUserName(e.target.value)} />
                        </div>
                        <hr />
                        <div>
                            <p className='mb-0'>Địa chỉ:</p>
                            <select className='form-select' value={formUserAddress} onChange={(e) => setFormUserAddress(e.target.value)}>
                                {user?.address ? user?.address.map((address, index) => (
                                    <option key={index} value={address}>
                                        {address}
                                    </option>
                                )) : (
                                    <option value="">
                                        Chưa có địa chỉ
                                    </option>
                                )}
                            </select>
                        </div>
                        <h6 className='mt-3 mb-3'>{user?.address ? "Hoặc Thêm Địa Chỉ Mới:" : "Thêm Địa Chỉ Mới:"}</h6>
                        <div>

                            <input className='form-control' value={newAddress} onChange={(e) => setNewAddress(e.target.value)} />
                            <div className='form-check'>
                                <input className='form-check-input' type='checkbox' id='saveAddress' checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} />
                                <label htmlFor='saveAddress' className='form-check-label'>Lưu lại địa chỉ</label>
                            </div>
                        </div>
                        <hr />
                        <div>
                            <p className='mb-0'>Số điện thoại:</p>
                            <input className='form-control' value={formUserPhone} onChange={(e) => setFormUserPhone(e.target.value)} />

                        </div>
                        <hr />
                        <button className='btn btn-primary' onClick={createOrder}>Xác nhận đặt hàng</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
