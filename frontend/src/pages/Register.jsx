import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
    const BASE_URL = import.meta.env.VITE_DJANGO_BASE_URL;

    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        password2: "",
        first_name: "",
        last_name: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (form.password !== form.password2) {
            setError("Passwords do not match.");
            return;
        }

        if (form.password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${BASE_URL}/api/users/register/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: form.username,
                        email: form.email,
                        password: form.password,
                        password2: form.password2,
                        first_name: form.first_name,
                        last_name: form.last_name,
                    }),
                }
            );

            const data = await response.json();

            console.log(
                "REGISTER RESPONSE:",
                JSON.stringify(data, null, 2)
            );

            if (!response.ok) {
                let errorMessage = "Registration failed.";

                if (data.detail) {
                    errorMessage = data.detail;
                } else {
                    const errors = Object.entries(data);

                    if (errors.length > 0) {
                        errorMessage = errors
                            .map(([field, messages]) => {
                                if (Array.isArray(messages)) {
                                    return `${field}: ${messages.join(", ")}`;
                                }

                                return `${field}: ${messages}`;
                            })
                            .join(" | ");
                    }
                }

                setError(errorMessage);
                return;
            }

            setSuccess(
                "Account created successfully! Redirecting to login..."
            );

            setForm({
                username: "",
                email: "",
                password: "",
                password2: "",
                first_name: "",
                last_name: "",
            });

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {
            console.error("Register error:", error);
            setError("Unable to connect to server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-6 py-12">

            <div className="mx-auto max-w-lg">

                <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">

                    {/* Header */}

                    <div className="mb-8 text-center">

                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-black text-white shadow-lg">
                            R
                        </div>

                        <h1 className="text-3xl font-extrabold text-slate-900">
                            Create Account
                        </h1>

                        <p className="mt-2 text-slate-500">
                            Join E-cart today
                        </p>

                    </div>

                    {/* Error */}

                    {error && (
                        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Success */}

                    {success && (
                        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-600">
                            {success}
                        </div>
                    )}

                    {/* Form */}

                    <form
                        onSubmit={handleRegister}
                        className="space-y-5"
                    >

                        {/* First + Last Name */}

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    First Name
                                </label>

                                <input
                                    type="text"
                                    name="first_name"
                                    value={form.first_name}
                                    onChange={handleChange}
                                    placeholder="First name"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Last Name
                                </label>

                                <input
                                    type="text"
                                    name="last_name"
                                    value={form.last_name}
                                    onChange={handleChange}
                                    placeholder="Last name"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>

                        </div>

                        {/* Username */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Username
                            </label>

                            <input
                                type="text"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                required
                                autoComplete="username"
                                placeholder="Enter username"
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />

                        </div>

                        {/* Email */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                autoComplete="email"
                                placeholder="Enter email"
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
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                autoComplete="new-password"
                                placeholder="Enter password"
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />

                            <p className="mt-1 text-xs text-slate-400">
                                Minimum 8 characters
                            </p>

                        </div>

                        {/* Confirm Password */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                name="password2"
                                value={form.password2}
                                onChange={handleChange}
                                required
                                autoComplete="new-password"
                                placeholder="Confirm password"
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />

                        </div>

                        {/* Button */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-indigo-600 px-5 py-3.5 font-bold text-white shadow-md transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                        >
                            {loading
                                ? "Creating Account..."
                                : "Create Account"}
                        </button>

                    </form>

                    {/* Login Link */}

                    <p className="mt-6 text-center text-sm text-slate-500">

                        Already have an account?{" "}

                        <Link
                            to="/login"
                            className="font-bold text-indigo-600 hover:text-indigo-700"
                        >
                            Login
                        </Link>

                    </p>

                </div>

            </div>

        </main>
    );
}

export default Register;