import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { UserProvider } from "./UserContext";
import Home from "./Pages/User/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import ProductDetail from "./Pages/User/ProductDetail";
import PersonalInfo from "./PersonalInfo";
import Order from "./Pages/User/Order";
import MyOrder from "./Pages/User/MyOrder";
import OrderList from "./Pages/Sale/OrderList";
import ProductList from "./Pages/Sale/ProductList";
import DashBoard from "./Pages/Manager/DashBoard";
import ProductManage from "./Pages/Manager/ProductManage";
import StaffManage from "./Pages/Manager/StaffManage";
import OrderManage from "./Pages/Manager/OrderManage";

function App() {
  return (
    <div className="App">
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/personal-info" element={<PersonalInfo />} />
            <Route path="/order/:id" element={<Order />} />
            <Route path="/my-order" element={<MyOrder />} />
            <Route path="/sale/order-list" element={<OrderList />} />
            <Route path="/sale/product-list" element={<ProductList />} />
            <Route path="/manager/dashboard" element={<DashBoard />} />
            <Route path="/manager/product-manage" element={<ProductManage />} />
            <Route path="/manager/staff-manage" element={<StaffManage />} />
            <Route path="/manager/order-manage" element={<OrderManage />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

export default App;
