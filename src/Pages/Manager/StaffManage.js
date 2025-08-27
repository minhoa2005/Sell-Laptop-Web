import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import Header from '../../Layout/Header';
import { userContext } from '../../UserContext';
import { useNavigate } from 'react-router-dom';

export default function StaffManage() {
    const { user, loading } = useContext(userContext);
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [staffDetail, setStaffDetail] = useState({});
    const [addMode, setAddMode] = useState(false);
    const [search, setSearch] = useState('');
    const fetchStaff = async () => {
        const response = await axios.get('http://localhost:9999/user?role=2');
        setData(response.data);
    };
    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:9999/user/${id}`);
        setData(data.filter(staff => staff.id !== id));
    };
    const updateStaff = async () => {
        await axios.put(`http://localhost:9999/user/${selectedStaff}`, staffDetail);
        alert('Cập nhật nhân viên thành công');
        setStaffDetail({});
        setSelectedStaff(null);
        fetchStaff();
    };
    const addStaff = async () => {
        if (!staffDetail.email || !staffDetail.password || !staffDetail.personalInfo?.name) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc (email, mật khẩu, tên)');
            return;
        }
        const emailCheck = await axios.get(`http://localhost:9999/user?email=${staffDetail.email}`);
        if (emailCheck.data.length > 0) {
            alert('Email đã tồn tại');
            return;
        }
        setStaffDetail({ ...staffDetail, role: 2 });
        await axios.post('http://localhost:9999/user', staffDetail);
        alert('Thêm nhân viên thành công');
        setAddMode(false);
        setStaffDetail({})
        fetchStaff();
    };
    const filter = () => {
        return data.filter(staff => {
            const matchName = staff.personalInfo?.name.toLowerCase().includes(search.toLowerCase());
            const matchPhone = staff.personalInfo?.phone?.toLowerCase().includes(search.toLowerCase());
            return matchName || matchPhone;
        })
    }
    useEffect(() => {
        if (!loading) {
            return;
        }
        if (!user) {
            navigate('login');
            return;
        }
        if (user?.role !== 3) {
            alert('Bạn không có quyền truy cập');
            navigate('/login');
            return;
        }
        fetchStaff();
    }, [loading, user])
    useEffect(() => {
        const searched = data.find(staff => staff.id === selectedStaff);
        setStaffDetail(searched || {});
    }, [selectedStaff]);
    return (
        <div>
            <Header />
            <br />
            <div className='container-fluid'>
                <h3>Quản lý nhân viên</h3>
                <div className='row'>
                    <div className='d-flex flex-row gap-3'>
                        <div className='col-8 mb-3'>
                            <input type="text" className='form-control' placeholder='Tìm kiếm nhân viên...' onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <div className='mb-3'>
                            <button className='btn btn-success' onClick={() => { setAddMode(true); setSelectedStaff(null); }}>Thêm nhân viên</button>
                        </div>
                    </div>
                    <div className='col-8 border shadow-sm rounded' style={{ overflowX: 'auto', maxHeight: '500px' }}>
                        <table className='table table-striped'>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Tên</th>
                                    <th>Số điện thoại</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filter().map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.personalInfo.name}</td>
                                        <td>{item.personalInfo.phone || 'Chưa cung cấp'}</td>
                                        <td>
                                            <div className='d-flex gap-2 justify-content-center'>
                                                <button className='btn btn-danger' onClick={() => { setSelectedStaff(item.id); setAddMode(false) }}>Chi tiết</button>
                                                <button className='btn btn-secondary' onClick={() => handleDelete(item.id)}>Xóa</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className='col-4 shadow-sm border rounded'>
                        <h4>{addMode ? 'Thêm nhân viên' : 'Chi tiết nhân viên'}</h4>
                        <hr />
                        {selectedStaff && !addMode ? (
                            <>
                                <div>
                                    <p className='mb-0 fw-bold'>Tên:</p>
                                    <input type="text" id='staff-name' className='form-control' value={staffDetail.personalInfo?.name || ''} onChange={(e) => setStaffDetail({ ...staffDetail, personalInfo: { ...staffDetail.personalInfo, name: e.target.value } })} />
                                    <p className='mb-0 fw-bold'>Số điện thoại:</p>
                                    <input type="text" id='staff-phone' className='form-control' value={staffDetail.personalInfo?.phone || ''} onChange={(e) => setStaffDetail({ ...staffDetail, personalInfo: { ...staffDetail.personalInfo, phone: e.target.value } })} />
                                    <p className='mb-0 fw-bold'>Email:</p>
                                    <input type="text" id='staff-email' className='form-control' value={staffDetail.email || ''} onChange={(e) => setStaffDetail({ ...staffDetail, email: e.target.value })} />
                                </div>
                                <hr />
                                <div className='d-flex justify-content-end gap-3 p-3'>
                                    <button className='btn btn-primary' onClick={() => updateStaff()}>Lưu</button>
                                    <button className='btn btn-secondary' onClick={() => setSelectedStaff(null)}>Hủy</button>
                                </div>
                            </>
                        ) :
                            addMode && !selectedStaff ? (
                                <>
                                    <div>
                                        <p className='mb-0 fw-bold'>Tên:</p>
                                        <input type="text" id='staff-name' className='form-control' value={staffDetail.personalInfo?.name || ''} onChange={(e) => setStaffDetail({ ...staffDetail, personalInfo: { ...staffDetail.personalInfo, name: e.target.value } })} />
                                        <p className='mb-0 fw-bold'>Số điện thoại:</p>
                                        <input type="text" id='staff-phone' className='form-control' value={staffDetail.personalInfo?.phone || ''} onChange={(e) => setStaffDetail({ ...staffDetail, personalInfo: { ...staffDetail.personalInfo, phone: e.target.value } })} />
                                        <p className='mb-0 fw-bold'>Email:</p>
                                        <input type="text" id='staff-email' className='form-control' value={staffDetail.email || ''} onChange={(e) => setStaffDetail({ ...staffDetail, email: e.target.value })} />
                                        <p className='mb-0 fw-bold'>Mật khẩu:</p>
                                        <input type="text" id='staff-password' className='form-control' value={staffDetail.password || ''} onChange={(e) => setStaffDetail({ ...staffDetail, password: e.target.value })} />
                                    </div>
                                    <hr />
                                    <div className='d-flex justify-content-end gap-3 p-3'>
                                        <button className='btn btn-primary' onClick={() => addStaff()}>Lưu</button>
                                        <button className='btn btn-secondary' onClick={() => setAddMode(false)}>Hủy</button>
                                    </div>
                                </>
                            ) : (
                                <div className='p-3'>
                                    <p className='text-muted'>Chọn một nhân viên để xem chi tiết</p>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </div>
    )
}
