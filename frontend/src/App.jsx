import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";

function App() {
    return (
        <>
            <Navbar />

            <Routes>

                <Route path="/" element={<Home />} />

                <Route
                    path="/products"
                    element={<Products />}
                />

                <Route
                    path="/cart"
                    element={<Cart />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/checkout"
                    element={<Checkout />}
                />

                <Route
                    path="/orders"
                    element={<Orders />}
                />

            </Routes>
        </>
    );
}

export default App;