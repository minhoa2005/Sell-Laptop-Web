import React, { use, useContext, useEffect, useState } from 'react'
import Header from './Layout/Header'
import { userContext } from './UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function PersonalInfo() {
  const { user, loading, updateUser } = useContext(userContext);
  const navigate = useNavigate();
  const [address, setAddress] = useState(user?.address || []);
  const [formName, setFormName] = useState(user?.personalInfo?.name || '');
  const [formEmail, setFormEmail] = useState(user?.email || '');
  const [formPhone, setFormPhone] = useState(user?.personalInfo?.phone || '');
  const [formCurrentPassword, setFormCurrentPassword] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formConfirmPassword, setFormConfirmPassword] = useState('');
  const addAddress = (index, value) => {
    setAddress(address.map((addr, i) => (i === index ? value : addr)));
  };
  const saveInformation = async () => {
    const data = {
      email: formEmail,
      personalInfo: {
        name: formName,
        phone: formPhone,
      },
      address
    }
    updateUser(data);
    await axios.patch(`http://localhost:9999/user/${user?.id}`, data);
    alert('Cập nhật thông tin thành công');
  };
  const changePassword = async () => {
    if (!formConfirmPassword || !formCurrentPassword || !formPassword) {
      alert('Vui lòng điền đủ thông tin');
      return;
    }
    if (formPassword !== formCurrentPassword) {
      setFormConfirmPassword('');
      alert('Mật khẩu không khớp');
      return;
    }
    const checkCurrent = await axios.get(`http://localhost:9999/user?email=${user.email}&password=${formCurrentPassword}`);
    if (checkCurrent.data.length === 0) {
      alert('Mật khẩu hiện tại không đúng');
      setFormCurrentPassword('');
      return;
    }
    await axios.patch(`http://localhost:9999/user/${user.id}`, {
      password: formPassword
    });
    setFormConfirmPassword('');
    setFormPassword('');
    setFormCurrentPassword('');
    alert('Đổi mật khẩu thành công');

  }
  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/login');
      return;
    }

    setAddress(user?.address || []);
    setFormName(user?.personalInfo?.name || '');
    setFormEmail(user?.email || '');
    setFormPhone(user?.personalInfo?.phone || '');
    console.log(user)
  }, [loading, user])
  return (
    <div>
      <Header />
      <div className='container-fluid p-3'>
        <h1>Thông Tin Cá Nhân</h1>
        <div className='shadow-sm border p-3 rounded'>
          <h2>Thông tin chung</h2>
          <div className=''>
            <label htmlFor="fullName" className='fw-bold'>Họ và tên:</label>
            <input type="text" id="fullName" className="form-control" value={formName} onChange={(e) => setFormName(e.target.value)} />
          </div>
          <div className=''>
            <label htmlFor="email" className='fw-bold'>Email:</label>
            <input type="email" id="email" className="form-control" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="phone" className='fw-bold'>Số điện thoại:</label>
            <input type="tel" id="phone" className="form-control" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} />
          </div>
          <div className='d-flex flex-column gap-2'>
            <label htmlFor="address" className='fw-bold'>Địa chỉ:</label>
            {(address || []).map((addr, index) => (
              <>
                <div key={index} className='d-flex gap-3'>
                  <input type="text" id="address" className="form-control" value={addr} onChange={(e) => addAddress(index, e.target.value)} />
                  <button className='btn btn-danger' onClick={() => { setAddress(address.filter((addr, i) => i !== index)) }}>Xóa</button>
                </div>

              </>
            ))}
            <div>
              <button className='btn btn-primary' onClick={() => { setAddress([...address, '']) }}>Thêm địa chỉ</button>
            </div>
          </div>
          <hr />
          <div className='d-flex justify-content-end gap-3'>
            <button className='btn btn-success' onClick={() => { saveInformation(); }}>Lưu</button>
          </div>
        </div>
        <br />
        <div className='shadow-sm border p-3 rounded'>
          <h2>Bảo mật</h2>
          <div>
            <label htmlFor="currentPassword" className='fw-bold'>Mật khẩu hiện tại:</label>
            <input type="password" id="currentPassword" className="form-control" onChange={(e) => setFormCurrentPassword(e.target.value)} />
          </div>
          <div className=''>
            <label htmlFor="password" className='fw-bold'>Mật khẩu mới:</label>
            <input type="password" id="password" className="form-control" onChange={(e) => setFormPassword(e.target.value)} />
          </div>
          <div className=''>
            <label htmlFor="confirmPassword" className='fw-bold'>Xác nhận mật khẩu:</label>
            <input type="password" id="confirmPassword" className="form-control" onChange={(e) => setFormConfirmPassword(e.target.value)} />
          </div>
          <div className='d-flex justify-content-end mt-3'>
            <button className='btn btn-primary' onClick={changePassword}>Đổi mật khẩu</button>
          </div>
        </div>
      </div>
    </div>
  )
}
