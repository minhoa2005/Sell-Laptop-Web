import React from 'react'

export default function Order() {
    return (
        <div>
            {/* có thể dùng grid để chia đôi 1 phần hiện sơ lược sản phẩm đang đặt, một bên là địa chỉ và xác nhận đặt */}
            <h1>Đặt Hàng</h1>
            <div className='container-fluid'>
                <div className='d-flex flex-row gap-5 border p-4 shadow-sm rounded'>
                    <img src="/laptop1.png" alt="Product" className="img-fluid rounded shadow-sm border" style={{ objectFit: 'cover' }} />
                    <div>
                        <h4>Tên sản phẩm</h4>
                        <p>Thông tin sản phẩm</p>
                        <p>Số lượng: 1</p>
                        <p>Giá: 10,000,000 VNĐ</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
