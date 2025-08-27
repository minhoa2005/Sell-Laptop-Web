import React, { useContext, useEffect, useState } from 'react'
import Header from '../../Layout/Header'
import axios from 'axios';
import { userContext } from '../../UserContext';
import { useNavigate } from 'react-router-dom';

export default function ProductList() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(userContext);
    const navigate = useNavigate();
    const fetchProduct = async () => {
        const response = await axios.get(`http://localhost:9999/products`);
        setData(response.data);
    }
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (user.role !== 2) {
            alert('Bạn không có quyền truy cập');
            navigate('/login');
            return;
        }
        fetchProduct();
    }, []);
    const filter = () => {
        return data.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }
    return (
        <div>
            <Header />
            <br />
            <div className='p-3'>
                <input type="text" className='form-control' placeholder='Tìm kiếm sản phẩm...' onChange={(e) => setSearch(e.target.value)} />
            </div>
            <br />
            <div>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>
                                No.
                            </th>
                            <th>Tên sản phẩm</th>
                            <th>Mô tả</th>
                            <th>Số lượng</th>
                            <th>Giá</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filter().map((item, index) => (
                            <tr key={item.id} style={{}}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.description}</td>
                                <td>{item.quantity}</td>
                                <td>{item.price}</td>
                                {/* 
                                <td>
                                    <button className='btn btn-primary'>Edit</button>
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
