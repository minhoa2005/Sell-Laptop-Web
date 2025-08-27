import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import Header from '../../Layout/Header';
import { useLocation, useNavigate } from 'react-router-dom';
import { userContext } from '../../UserContext';

export default function ProductManage() {
    const { user } = useContext(userContext);
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productDetail, setProductDetail] = useState({});
    const [addMode, setAddMode] = useState(false);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('asc');
    const { id } = useLocation().state || {};


    const fetchProduct = async () => {
        const response = await axios.get('http://localhost:9999/products');
        if (id) {
            setSelectedProduct(id);
        }
        setData(response.data);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            await axios.delete(`http://localhost:9999/products/${id}`);
            setData(data.filter(product => product.id !== id));
        }
    };

    const updateProduct = async () => {
        if (!productDetail.name || !productDetail.price || !productDetail.currentPrice) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc (tên, giá gốc, giá hiện tại)');
            return;
        }
        await axios.put(`http://localhost:9999/products/${selectedProduct}`, productDetail);
        alert('Cập nhật sản phẩm thành công');
        setProductDetail({});
        setSelectedProduct(null);
        fetchProduct();
    };

    const addProduct = async () => {
        if (!productDetail.name || !productDetail.price || !productDetail.quantity) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc (tên, giá gốc, giá hiện tại, số lượng)');
            return;
        }
        await axios.post('http://localhost:9999/products', productDetail);
        alert('Thêm sản phẩm thành công');
        setAddMode(false);
        setProductDetail({})
        fetchProduct();
    };

    const filter = () => {
        return data.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }
    const handleSort = () => {
        if (sort === 'asc') {
            setSort('desc');
            const sorted = [...data].sort((a, b) => {
                return a.quantity - b.quantity;
            });
            setData(sorted);
        } else {
            setSort('asc');
            const sorted = [...data].sort((a, b) => {
                return b.quantity - a.quantity;
            });
            setData(sorted);
        }
    }

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
        fetchProduct();
    }, [])

    useEffect(() => {
        const searched = data.find(product => product.id === selectedProduct);
        setProductDetail(searched || {});
    }, [selectedProduct]);

    return (
        <div>
            <Header />
            <br />
            <div className='container-fluid'>
                <h3>Quản lý sản phẩm</h3>
                <div className='row'>
                    <div className='d-flex flex-row gap-3'>
                        <div className='col-8 mb-3 d-flex gap-3'>
                            <input type="text" className='form-control' style={{ width: '80%' }} placeholder='Tìm kiếm sản phẩm...' onChange={(e) => setSearch(e.target.value)} />
                            <button className='btn btn-primary' onClick={() => handleSort()}>Sắp xếp theo số lượng</button>
                        </div>
                        <div className='mb-3'>
                            <button className='btn btn-success' onClick={() => { setAddMode(true); setSelectedProduct(null); }}>Thêm sản phẩm</button>
                        </div>
                    </div>
                    <div className='col-8 border shadow-sm rounded' style={{ overflowX: 'auto', maxHeight: '500px' }}>
                        <table className='table table-striped'>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Số lượng</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filter().map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.quantity}</td>
                                        <td>
                                            <div className='d-flex gap-2 justify-content-center'>
                                                <button className='btn btn-danger' onClick={() => { setSelectedProduct(item.id); setAddMode(false) }}>Chi tiết</button>
                                                <button className='btn btn-secondary' onClick={() => handleDelete(item.id)}>Xóa</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className='col-4 shadow-sm border rounded'>
                        <h4>{addMode ? 'Thêm sản phẩm' : 'Chi tiết sản phẩm'}</h4>
                        <hr />
                        {selectedProduct && !addMode ? (
                            <>
                                <div>
                                    <p className='mb-0 fw-bold'>Tên sản phẩm:</p>
                                    <input type="text" className='form-control mb-2' value={productDetail.name || ''} onChange={(e) => setProductDetail({ ...productDetail, name: e.target.value })} />
                                    <p className='mb-0 fw-bold'>Mô tả:</p>
                                    <textarea className='form-control mb-2' rows="3" value={productDetail.description || ''} onChange={(e) => setProductDetail({ ...productDetail, description: e.target.value })} />
                                    <p className='mb-0 fw-bold'>Giá:</p>
                                    <input type="text" className='form-control mb-2' value={productDetail.price || ''} onChange={(e) => setProductDetail({ ...productDetail, price: e.target.value })} />
                                    <p className='mb-0 fw-bold'>Hình ảnh:</p>
                                    <input type="text" className='form-control mb-2' value={productDetail.image || ''} onChange={(e) => setProductDetail({ ...productDetail, image: e.target.value })} />
                                    <p className='mb-0 fw-bold'>Số lượng:</p>
                                    <input type="number" className='form-control mb-2' value={productDetail.quantity || ''} onChange={(e) => setProductDetail({ ...productDetail, quantity: parseInt(e.target.value) || 0 })} />
                                </div>
                                <hr />
                                <div className='d-flex justify-content-end gap-3 p-3'>
                                    <button className='btn btn-primary' onClick={() => updateProduct()}>Lưu</button>
                                    <button className='btn btn-secondary' onClick={() => setSelectedProduct(null)}>Hủy</button>
                                </div>
                            </>
                        ) :
                            addMode && !selectedProduct ? (
                                <>
                                    <div>
                                        <p className='mb-0 fw-bold'>Tên sản phẩm:</p>
                                        <input type="text" className='form-control mb-2' value={productDetail.name || ''} onChange={(e) => setProductDetail({ ...productDetail, name: e.target.value })} />
                                        <p className='mb-0 fw-bold'>Mô tả:</p>
                                        <textarea className='form-control mb-2' rows="3" value={productDetail.description || ''} onChange={(e) => setProductDetail({ ...productDetail, description: e.target.value })} />
                                        <p className='mb-0 fw-bold'>Giá:</p>
                                        <input type="text" className='form-control mb-2' value={productDetail.price || ''} onChange={(e) => setProductDetail({ ...productDetail, price: e.target.value })} />
                                        <p className='mb-0 fw-bold'>Hình ảnh:</p>
                                        <input type="text" className='form-control mb-2' placeholder="Tên file ảnh (vd: laptop10.png)" value={productDetail.image || ''} onChange={(e) => setProductDetail({ ...productDetail, image: e.target.value })} />
                                        <p className='mb-0 fw-bold'>Số lượng:</p>
                                        <input type="number" className='form-control mb-2' value={productDetail.quantity || ''} onChange={(e) => setProductDetail({ ...productDetail, quantity: parseInt(e.target.value) || 0 })} />
                                    </div>
                                    <hr />
                                    <div className='d-flex justify-content-end gap-3 p-3'>
                                        <button className='btn btn-primary' onClick={() => addProduct()}>Lưu</button>
                                        <button className='btn btn-secondary' onClick={() => setAddMode(false)}>Hủy</button>
                                    </div>
                                </>
                            ) : (
                                <div className='p-3'>
                                    <p className='text-muted'>Chọn một sản phẩm để xem chi tiết</p>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </div>
    )
}
