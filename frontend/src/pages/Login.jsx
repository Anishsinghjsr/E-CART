import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const BASE_URL = import.meta.env.VITE_DJANGO_BASE_URL;

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                `${BASE_URL}/api/users/login/`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        username: username,
                        password: password,
                    }),
                }
            );

            const data = await response.json();

            console.log("Login response:", data);

            if (!response.ok) {
                setError(
                    data.detail ||
                    data.error ||
                    "Invalid username or password."
                );

                return;
            }

            // Save JWT access token
            if (data.access) {
                localStorage.setItem(
                    "access_token",
                    data.access
                );
            }

            // Save JWT refresh token
            if (data.refresh) {
                localStorage.setItem(
                    "refresh_token",
                    data.refresh
                );
            }

            // Save username
            localStorage.setItem(
                "username",
                username
            );

            // Login successful
            navigate("/products");

        } catch (error) {
            console.error("Login error:", error);

            setError(
                "Unable to connect to server."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-6 py-12">

            <div className="mx-auto max-w-md">

                <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200">

                    {/* Heading */}
                    <div className="mb-8 text-center">

                        <h1 className="text-3xl font-extrabold text-slate-900">
                            Welcome Back
                        </h1>

                        <p className="mt-2 text-slate-500">
                            Login to your E-CART account
                        </p>

                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Login Form */}
                    <form
                        onSubmit={handleLogin}
                        className="space-y-5"
                    >

                        {/* Username */}
                        <div>

                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Username
                            </label>

                            <input
                                type="text"
                                value={username}
                                onChange={(e) =>
                                    setUsername(e.target.value)
                                }
                                required
                                placeholder="Enter username"
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />

                        </div>

                        {/* Password */}
                        <div>

                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                                placeholder="Enter password"
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />

                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                        >
                            {loading
                                ? "Logging in..."
                                : "Login"}
                        </button>

                    </form>

                    {/* Register Link */}
                    <p className="mt-6 text-center text-sm text-slate-500">

                        Don't have an account?{" "}

                        <Link
                            to="/register"
                            className="font-bold text-indigo-600 hover:text-indigo-700"
                        >
                            Register
                        </Link>

                    </p>

                </div>

            </div>

        </main>
    );
}

export default Login;