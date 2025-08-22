
import { BrowserRouter, Navigate, Route, Router, Routes } from "react-router-dom";
import { UserProvider } from "./UserContext";
import Home from "./Pages/User/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import ProductDetail from "./Pages/User/ProductDetail";
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

          </Routes>
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

export default App;
