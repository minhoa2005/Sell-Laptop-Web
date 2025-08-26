import React, { useContext, useEffect, useState } from 'react'
import { userContext } from '../../UserContext'
import { useNavigate } from 'react-router-dom';
import Header from '../../Layout/Header';
import axios from 'axios';

export default function Home() {
    const { user, loading } = useContext(userContext);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const fetchProduct = async () => {
        try {
            const response = await axios.get('http://localhost:9999/products');
            setProducts(response.data);
            console.log('Products fetched successfully:', response.data);

        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };
    useEffect(() => {
        if (loading) return;
        if (!user) {
            navigate('/login');
        }
        else {
            if (user?.role === 1) {
                fetchProduct();
            }
            if (user?.role === 2) {
                navigate('/sale/order-list');
            }
        }
    }, [user, loading]);
    return (
        <div>
            <Header />
            <div className='d-flex flex-wrap gap-5 container-fluid'>
                {products.map(product => (
                    <div className='card' key={product.id} style={{ width: '16rem', cursor: 'pointer' }} onClick={() => navigate(`/product/${product.id}`)}>
                        <img src={product.image} alt={product.name} style={{ objectFit: 'cover', height: '200px' }} />
                        <div className='card-body'>
                            <h5 className='text-danger card-title'>{product.name}</h5>
                            <p className='card-text'>{product.description}</p>

                        </div>
                        <p className='card-text fs-5 text-center mb-0 text-danger'>{product.price} VNĐ</p>
                        <div className='card-footer btn btn-primary' style={{ cursor: 'pointer', }} onClick={(e) => { e.stopPropagation(); product?.quantity > 0 && navigate(`/order/${product.id}`) }}>
                            {product.quantity === 0 ? <p className='text-center mb-0'>Hết hàng</p> : <p className='text-center mb-0'>Đặt hàng</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
