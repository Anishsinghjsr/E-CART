import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authFetch } from "../utils/auth";

function Cart() {
    const BASE_URL = import.meta.env.VITE_DJANGO_BASE_URL;

    const navigate = useNavigate();

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
                    data.detail || "Failed to load cart."
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

    useEffect(() => {
        fetchCart();
    }, []);

    // UPDATE QUANTITY
    const updateQuantity = async (itemId, quantity) => {
        if (quantity < 1) {
            return;
        }

        try {
            const response = await authFetch(
                `${BASE_URL}/api/cart/items/${itemId}/`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        quantity: quantity,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(
                    data.error ||
                    data.detail ||
                    "Unable to update cart."
                );
                return;
            }

            await fetchCart();
        } catch (error) {
            console.error(error);
            alert("Unable to connect to server.");
        }
    };

    // REMOVE ITEM
    const removeItem = async (itemId) => {
        try {
            const response = await authFetch(
                `${BASE_URL}/api/cart/items/${itemId}/remove/`,
                {
                    method: "DELETE",
                }
            );

            const data = response.status !== 204
                ? await response.json()
                : null;

            if (!response.ok) {
                alert(
                    data?.error ||
                    data?.detail ||
                    "Unable to remove item."
                );
                return;
            }

            await fetchCart();
        } catch (error) {
            console.error(error);
            alert("Unable to connect to server.");
        }
    };

    // LOADING
    if (loading) {
        return (
            <main className="mx-auto max-w-7xl px-6 py-20 text-center">
                <div className="text-2xl font-bold text-indigo-600">
                    Loading cart...
                </div>
            </main>
        );
    }

    // ERROR
    if (error) {
        return (
            <main className="mx-auto max-w-7xl px-6 py-20 text-center">
                <div className="rounded-xl bg-red-50 p-5 text-red-600">
                    {error}
                </div>
            </main>
        );
    }

    // EMPTY CART
    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <main className="mx-auto max-w-3xl px-6 py-20 text-center">

                <div className="rounded-3xl bg-white p-12 shadow-lg ring-1 ring-slate-200">

                    <div className="text-7xl">
                        🛒
                    </div>

                    <h1 className="mt-5 text-3xl font-extrabold text-slate-900">
                        Your Cart is Empty
                    </h1>

                    <p className="mt-3 text-slate-500">
                        Add some products to your cart.
                    </p>

                    <Link
                        to="/products"
                        className="mt-7 inline-block rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition hover:bg-indigo-700"
                    >
                        Browse Products
                    </Link>

                </div>

            </main>
        );
    }

    return (
        <main className="mx-auto max-w-7xl px-6 py-12">

            <div className="mb-10">
                <p className="text-sm font-bold uppercase tracking-wider text-indigo-600">
                    E-cart
                </p>

                <h1 className="mt-2 text-4xl font-extrabold text-slate-900">
                    Shopping Cart
                </h1>

                <p className="mt-2 text-slate-500">
                    Review your items before checkout.
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">

                {/* CART ITEMS */}
                <div className="space-y-4 lg:col-span-2">

                    {cart.items.map((item) => (

                        <div
                            key={item.id}
                            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
                        >

                            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                                {/* PRODUCT INFO */}
                                <div className="flex-1">

                                    <h2 className="text-xl font-bold text-slate-900">
                                        {item.product_name}
                                    </h2>

                                    <p className="mt-1 text-slate-500">
                                        ₹{item.price}
                                    </p>

                                </div>

                                {/* QUANTITY */}
                                <div className="flex items-center gap-3">

                                    <button
                                        onClick={() =>
                                            updateQuantity(
                                                item.id,
                                                item.quantity - 1
                                            )
                                        }
                                        className="h-9 w-9 rounded-lg bg-slate-100 text-lg font-bold hover:bg-slate-200"
                                    >
                                        −
                                    </button>

                                    <span className="w-8 text-center font-bold">
                                        {item.quantity}
                                    </span>

                                    <button
                                        onClick={() =>
                                            updateQuantity(
                                                item.id,
                                                item.quantity + 1
                                            )
                                        }
                                        className="h-9 w-9 rounded-lg bg-slate-100 text-lg font-bold hover:bg-slate-200"
                                    >
                                        +
                                    </button>

                                </div>

                                {/* PRICE */}
                                <div className="text-left sm:text-right">

                                    <p className="text-xl font-extrabold text-indigo-600">
                                        ₹{item.subtotal}
                                    </p>

                                    <button
                                        onClick={() =>
                                            removeItem(item.id)
                                        }
                                        className="mt-2 text-sm font-semibold text-red-500 hover:text-red-700"
                                    >
                                        Remove
                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

                {/* ORDER SUMMARY */}
                <div className="h-fit rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200">

                    <h2 className="text-2xl font-extrabold text-slate-900">
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

                    <Link
                        to="/checkout"
                        className="mt-6 block rounded-xl bg-indigo-600 px-5 py-3 text-center font-bold text-white transition hover:bg-indigo-700"
                    >
                        Proceed to Checkout
                    </Link>

                    <Link
                        to="/products"
                        className="mt-3 block rounded-xl border border-slate-300 px-5 py-3 text-center font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                        Continue Shopping
                    </Link>

                </div>

            </div>

        </main>
    );
}

export default Cart;