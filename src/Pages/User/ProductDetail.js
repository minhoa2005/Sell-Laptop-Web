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
            <div>
                <h2>Thông tin sản phẩm</h2>
                <p>Tên sản phẩm: {product.name}</p>
                <img src={`/${product.image}`} alt={product.name} />
                <p>Giá: {product.price} VNĐ</p>
                <p>Mô tả: {product.description}</p>
            </div>
        </div>
    )
}
