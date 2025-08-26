
import { BrowserRouter, Navigate, Route, Router, Routes } from "react-router-dom";
import { UserProvider } from "./UserContext";
import Home from "./Pages/User/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import ProductDetail from "./Pages/User/ProductDetail";
import PersonalInfo from "./Pages/User/PersonalInfo";
import Order from "./Pages/User/Order";
import MyOrder from "./Pages/User/MyOrder";
import OrderList from "./Pages/Sale/OrderList";
import ProductList from "./Pages/Sale/ProductList";
import PersonalSaleInfo from "./Pages/Sale/PersonalInfo";

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
            <Route path="/sale/personal-info" element={<PersonalSaleInfo />} />
            <Route path="/sale/product-list" element={<ProductList />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

export default App;
