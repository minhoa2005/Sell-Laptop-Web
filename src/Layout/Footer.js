import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-light border-top mt-5">
            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-md-4">
                        <h5 className="fw-bold mb-3">Về chúng tôi</h5>
                        <p className="text-muted">
                            Hệ thống quản lý sản phẩm và đơn hàng chuyên nghiệp,
                            giúp doanh nghiệp tối ưu hóa quy trình bán hàng.
                        </p>
                    </div>
                    <div className="col-md-4">
                        <h5 className="fw-bold mb-3">Liên kết nhanh</h5>
                        <ul className="list-unstyled">
                            <li><a href="#" className="text-muted text-decoration-none">Sản phẩm</a></li>
                            <li><a href="#" className="text-muted text-decoration-none">Đơn hàng</a></li>
                            <li><a href="#" className="text-muted text-decoration-none">Hỗ trợ</a></li>
                            <li><a href="#" className="text-muted text-decoration-none">Chính sách</a></li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h5 className="fw-bold mb-3">Liên hệ</h5>
                        <p className="text-muted mb-1">Email: support@example.com</p>
                        <p className="text-muted mb-1">Điện thoại: (84) 123-456-789</p>
                        <p className="text-muted">Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</p>
                    </div>
                </div>
                <hr className="my-4" />
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <p className="text-muted mb-0">&copy; 2024 Hệ thống quản lý. Tất cả quyền được bảo lưu.</p>
                    </div>
                    <div className="col-md-6 text-md-end">
                        <p className="text-muted mb-0">Phiên bản 1.0.0</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
