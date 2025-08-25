import React, { useEffect, useState } from 'react'
import Header from '../../Layout/Header'
import axios from 'axios';

export default function ProductList() {
    const [data, setData] = useState([]);
    const fetchProduct = async () => {
        const response = await axios.get(`http://localhost:9999/products`);
        setData(response.data);
    }
    useEffect(() => {
        fetchProduct();
    }, []);
    return (
        <div>
            <Header />
            <div>
                filter
            </div>
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
                        {data.map((item, index) => (
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
