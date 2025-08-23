import React from 'react'
import Header from '../../Layout/Header'

export default function PersonalInfo() {
  return (
    <div>
      <Header />
      <h1>Thông Tin Cá Nhân</h1>
      <div className='container-fluid'>
        <div className='shadow-sm border p-3 rounded'>
          <h2>Thông tin chung</h2>
          <div className=''>
            <label htmlFor="fullName" className='fw-bold'>Họ và tên:</label>
            <input type="text" id="fullName" className="form-control" />
          </div>
          <div className=''>
            <label htmlFor="email" className='fw-bold'>Email:</label>
            <input type="email" id="email" className="form-control" />
          </div>
          <div>
            <label htmlFor="phone" className='fw-bold'>Số điện thoại:</label>
            <input type="tel" id="phone" className="form-control" />
          </div>
        </div>
        <hr />
        <div>
          <h2>Địa chỉ</h2>
          <button className='btn btn-primary'>Thêm địa chỉ</button>
          <div className=''>
            <label htmlFor="address" className='fw-bold'>Địa chỉ:</label>
            <div className='d-flex gap-3'>
              <input type="text" id="address" className="form-control" />
              <button className='btn btn-danger'>Xóa</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
