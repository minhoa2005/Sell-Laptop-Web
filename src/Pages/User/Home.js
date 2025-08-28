import React, { useContext, useEffect, useState } from 'react'
import { userContext } from '../../UserContext'
import { useNavigate } from 'react-router-dom';
import Header from '../../Layout/Header';
import axios from 'axios';

export default function Home() {
    const { user, loading } = useContext(userContext);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const [searchFilter, setSearchFilter] = useState('');
    const [priceFilter, setPriceFilter] = useState('');
    const fetchProduct = async () => {
        try {
            const response = await axios.get('http://localhost:9999/products');
            setProducts(response.data);
            console.log(response.data);

        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };
    const filter = () => {
        return products.filter(product => {
            console.log(product.name.toLowerCase());
            const matchSearch = product.name.toLowerCase().includes(searchFilter.toLowerCase());
            const price = product.price.split('.').join('');
            const matchPrice = priceFilter.length === 0 || (priceFilter === '5' && price < 5000000) ||
                (priceFilter === '5-10' && price >= 5000000 && price <= 10000000) ||
                (priceFilter === '10-20' && price > 10000000 && price <= 20000000) ||
                (priceFilter === '20' && price > 20000000);
            return matchPrice && matchSearch;
        })
    }
    useEffect(() => {
        // if (loading) return;
        // if (!user) {
        //     navigate('/login');
        //     return;
        // }
        // else {
        // if (user?.role === 1) {
        fetchProduct();
        // return;
        // }
        // else {
        //     navigate('/login');
        //     return;
        // }
    }, []);
    return (
        <div>
            <Header />
            <br />
            <div className='d-flex flex-row p-3 gap-3'>
                <input type="text" className='form-control' placeholder='Tìm kiếm sản phẩm...' onChange={(e) => setSearchFilter(e.target.value)} />
                <select className='form-select' onChange={(e) => setPriceFilter(e.target.value)}>
                    <option value="">Tìm theo giá</option>
                    <option value="5">Dưới 5 triệu</option>
                    <option value="5-10">5 triệu - 10 triệu</option>
                    <option value="10-20">10 triệu - 20 triệu</option>
                    <option value="20">Trên 20 triệu</option>
                </select>
            </div>
            <br />
            <div className='d-flex flex-wrap gap-5 container-fluid p-3'>
                {filter().map(product => (
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
