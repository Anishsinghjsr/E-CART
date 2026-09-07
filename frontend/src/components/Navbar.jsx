import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
    const navigate = useNavigate();

    const [loggedIn, setLoggedIn] = useState(
        !!localStorage.getItem("access_token")
    );

    const [username, setUsername] = useState(
        localStorage.getItem("username") || ""
    );

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("username");

        setLoggedIn(false);
        setUsername("");

        navigate("/login");
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white">

            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                {/* Logo */}
                <Link
                    to="/"
                    className="text-2xl font-extrabold text-indigo-600"
                >
                    E-CART
                </Link>

                <div className="flex items-center gap-5">

                    {/* Home */}
                    <Link
                        to="/"
                        className="font-semibold text-slate-600 hover:text-indigo-600"
                    >
                        Home
                    </Link>

                    {/* Products */}
                    <Link
                        to="/products"
                        className="font-semibold text-slate-600 hover:text-indigo-600"
                    >
                        Products
                    </Link>

                    {/* Cart */}
                    <Link
                        to="/cart"
                        className="font-semibold text-slate-600 hover:text-indigo-600"
                    >
                        Cart
                    </Link>

                    {/* Orders */}
                    <Link
                        to="/orders"
                        className="font-semibold text-slate-600 hover:text-indigo-600"
                    >
                        My Orders
                    </Link>

                    {!loggedIn ? (
                        <>
                            {/* Login */}
                            <Link
                                to="/login"
                                className="rounded-lg border border-indigo-600 px-4 py-2 font-semibold text-indigo-600 hover:bg-indigo-50"
                            >
                                Login
                            </Link>

                            {/* Register */}
                            <Link
                                to="/register"
                                className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
                            >
                                Register
                            </Link>
                        </>
                    ) : (
                        <>
                            {/* Username */}
                            <span className="font-semibold text-slate-700">
                                Hi, {username}
                            </span>

                            {/* Logout */}
                            <button
                                onClick={logout}
                                className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600"
                            >
                                Logout
                            </button>
                        </>
                    )}

                </div>

            </div>

        </nav>
    );
}

export default Navbar;