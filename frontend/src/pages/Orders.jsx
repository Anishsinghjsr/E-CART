import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/auth";

function Orders() {
    const BASE_URL = import.meta.env.VITE_DJANGO_BASE_URL;

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await authFetch(
                    `${BASE_URL}/api/orders/`
                );

                const data = await response.json();

                if (!response.ok) {
                    if (response.status === 401) {
                        navigate("/login");
                        return;
                    }

                    throw new Error(
                        data.detail ||
                        "Unable to load orders."
                    );
                }

                setOrders(data);

            } catch (error) {
                console.error(error);
                setError("Unable to load orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <main className="px-6 py-20 text-center">
                <h2 className="text-2xl font-bold text-indigo-600">
                    Loading orders...
                </h2>
            </main>
        );
    }

    if (error) {
        return (
            <main className="px-6 py-20 text-center">
                <p className="font-semibold text-red-500">
                    {error}
                </p>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-5xl px-6 py-12">

            <div className="mb-10">

                <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
                    E-cart
                </p>

                <h1 className="mt-2 text-4xl font-extrabold">
                    My Orders
                </h1>

            </div>

            {orders.length === 0 ? (

                <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200">

                    <div className="text-6xl">
                        📦
                    </div>

                    <h2 className="mt-5 text-2xl font-bold">
                        No Orders Yet
                    </h2>

                    <p className="mt-2 text-slate-500">
                        Your orders will appear here.
                    </p>

                </div>

            ) : (

                <div className="space-y-6">

                    {orders.map((order) => (

                        <div
                            key={order.id}
                            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
                        >

                            <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row">

                                <div>

                                    <h2 className="text-xl font-extrabold">
                                        Order #{order.id}
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        {new Date(
                                            order.created_at
                                        ).toLocaleString()}
                                    </p>

                                </div>

                                <div className="text-left sm:text-right">

                                    <span className="inline-block rounded-full bg-yellow-100 px-4 py-1 text-sm font-bold text-yellow-700">
                                        {order.status}
                                    </span>

                                    <p className="mt-2 text-xl font-extrabold text-indigo-600">
                                        ₹{order.total_amount}
                                    </p>

                                </div>

                            </div>

                            <div className="mt-5">

                                <h3 className="font-bold">
                                    Items
                                </h3>

                                <div className="mt-3 space-y-3">

                                    {order.items.map((item) => (

                                        <div
                                            key={item.id}
                                            className="flex justify-between rounded-xl bg-slate-50 px-4 py-3"
                                        >

                                            <span>
                                                {item.product_name} ×{" "}
                                                {item.quantity}
                                            </span>

                                            <span className="font-bold">
                                                ₹{item.subtotal}
                                            </span>

                                        </div>

                                    ))}

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </main>
    );
}

export default Orders;