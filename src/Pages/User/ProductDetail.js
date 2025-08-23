import React, { use, useContext, useEffect, useState } from 'react'
import Header from '../../Layout/Header'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import { userContext } from '../../UserContext';

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState({});
    const { user, loading } = useContext(userContext);
    const navigate = useNavigate();
    const fetchProduct = async () => {
        try {
            const response = await axios.get(`http://localhost:9999/products/${id}`);
            console.log(response.data.image)
            setProduct(response.data);
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };

    useEffect(() => {
        if (loading) return;
        if (!user) {
            navigate('/login');
        }
        else {
            if (user.role === 1) {
                fetchProduct();
            }
        }

    }, [user, loading, id]);
    return (
        <div>
            <Header />
            <div className="container-fluid py-4">
                <h2 className="mb-4">Thông tin sản phẩm</h2>

                {(!product || !product.name) ? (
                    <div className="d-flex justify-content-center py-5">
                        <div className="spinner-border" role="status" aria-hidden="true"></div>
                    </div>
                ) : (
                    <div className="row g-4">
                        <div className="col-md-6">
                            <img
                                src={product.image ? `/${product.image}` : '/placeholder.png'}
                                alt={product.name}
                                className="img-fluid rounded shadow-sm w-100 border"
                                style={{ maxHeight: 480, objectFit: 'cover' }}
                                onError={(e) => { e.currentTarget.src = '/placeholder.png'; }}
                            />
                        </div>

                        <div className="col-md-6">
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h3 className="card-title">{product.name}</h3>

                                    <div className="mb-2">
                                        <span className="badge bg-success">Còn hàng</span>
                                    </div>

                                    <div className="fs-3 fw-bold text-danger mb-3">
                                        {product.price}
                                    </div>

                                    <p className="text-secondary mb-4">
                                        {product.description}
                                    </p>

                                    <div className="d-flex gap-2">
                                        <button className="btn btn-primary">Thêm vào giỏ</button>
                                        <button className="btn btn-outline-secondary">Mua ngay</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
