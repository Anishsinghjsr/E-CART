import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authFetch } from "../utils/auth";

function Checkout() {
    const BASE_URL = import.meta.env.VITE_DJANGO_BASE_URL;
    const navigate = useNavigate();

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await authFetch(
                    `${BASE_URL}/api/cart/`
                );

                const data = await response.json();

                if (!response.ok) {
                    if (response.status === 401) {
                        navigate("/login");
                        return;
                    }

                    throw new Error(
                        data.detail || "Unable to load cart."
                    );
                }

                setCart(data);

            } catch (error) {
                console.error(error);
                setError("Unable to load cart.");
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [BASE_URL, navigate]);


    const placeOrder = async () => {

        setCheckoutLoading(true);
        setError("");

        try {

            const response = await authFetch(
                `${BASE_URL}/api/orders/checkout/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            console.log("Checkout response:", data);

            if (!response.ok) {

                setError(
                    data.detail ||
                    data.error ||
                    "Checkout failed."
                );

                return;
            }

            alert("Order placed successfully!");

            navigate("/orders");

        } catch (error) {

            console.error(error);

            setError(
                "Unable to connect to server."
            );

        } finally {

            setCheckoutLoading(false);

        }
    };


    if (loading) {
        return (
            <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-6 py-20">

                <div className="mx-auto max-w-3xl text-center">

                    <h1 className="text-2xl font-bold text-indigo-600">
                        Loading checkout...
                    </h1>

                </div>

            </main>
        );
    }


    if (error && !cart) {
        return (
            <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-6 py-20">

                <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">

                    <p className="font-semibold text-red-500">
                        {error}
                    </p>

                    <Link
                        to="/cart"
                        className="mt-6 inline-block rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white"
                    >
                        Back to Cart
                    </Link>

                </div>

            </main>
        );
    }


    if (!cart || !cart.items || cart.items.length === 0) {

        return (
            <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-6 py-20">

                <div className="mx-auto max-w-3xl rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">

                    <div className="text-6xl">
                        🛒
                    </div>

                    <h1 className="mt-5 text-3xl font-extrabold text-slate-900">
                        Your Cart is Empty
                    </h1>

                    <p className="mt-3 text-slate-500">
                        Add products before checkout.
                    </p>

                    <Link
                        to="/products"
                        className="mt-6 inline-block rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white hover:bg-indigo-700"
                    >
                        Browse Products
                    </Link>

                </div>

            </main>
        );
    }


    return (
        <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-6 py-12">

            <div className="mx-auto max-w-5xl">

                <h1 className="mb-8 text-4xl font-extrabold text-slate-900">
                    Checkout
                </h1>


                {error && (
                    <div className="mb-6 rounded-xl bg-red-50 px-5 py-4 font-semibold text-red-600">
                        {error}
                    </div>
                )}


                <div className="grid gap-8 lg:grid-cols-3">

                    {/* Order Items */}

                    <div className="space-y-4 lg:col-span-2">

                        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

                            <h2 className="mb-6 text-2xl font-extrabold">
                                Order Items
                            </h2>

                            <div className="space-y-4">

                                {cart.items.map((item) => (

                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
                                    >

                                        <div>

                                            <h3 className="font-bold text-slate-900">
                                                {item.product_name}
                                            </h3>

                                            <p className="mt-1 text-sm text-slate-500">
                                                ₹{item.price} × {item.quantity}
                                            </p>

                                        </div>

                                        <p className="font-extrabold text-indigo-600">
                                            ₹{item.subtotal}
                                        </p>

                                    </div>

                                ))}

                            </div>

                        </div>

                    </div>


                    {/* Summary */}

                    <div className="h-fit rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

                        <h2 className="text-2xl font-extrabold">
                            Order Summary
                        </h2>

                        <div className="my-6 border-t border-slate-200" />

                        <div className="flex justify-between text-lg">

                            <span className="text-slate-500">
                                Total
                            </span>

                            <span className="font-extrabold text-slate-900">
                                ₹{cart.total}
                            </span>

                        </div>


                        <button
                            onClick={placeOrder}
                            disabled={checkoutLoading}
                            className="mt-7 w-full rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                        >
                            {checkoutLoading
                                ? "Placing Order..."
                                : "Place Order"}
                        </button>


                        <Link
                            to="/cart"
                            className="mt-3 block text-center text-sm font-semibold text-slate-500 hover:text-indigo-600"
                        >
                            ← Back to Cart
                        </Link>

                    </div>

                </div>

            </div>

        </main>
    );
}

export default Checkout;