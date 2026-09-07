import { useEffect, useState } from "react";

function Products() {
    const BASE_URL = import.meta.env.VITE_DJANGO_BASE_URL;

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(
                    `${BASE_URL}/api/products/`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.detail || "Failed to load products."
                    );
                }

                setProducts(data);
            } catch (err) {
                console.error(err);
                setError("Unable to load products.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [BASE_URL]);

    const addToCart = async (productId) => {
        const token = localStorage.getItem("access_token");

        if (!token) {
            setMessage("Please login first.");
            return;
        }

        try {
            setMessage("");

            const response = await fetch(
                `${BASE_URL}/api/cart/add/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        product: productId,
                        quantity: 1,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.detail ||
                    data.error ||
                    "Failed to add product to cart."
                );
                return;
            }

            setMessage(
                `${data.product} added to cart successfully!`
            );
        } catch (err) {
            console.error(err);
            setMessage("Unable to connect to server.");
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-slate-50 px-6 py-16">
                <div className="mx-auto max-w-7xl text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>

                    <p className="mt-4 text-slate-500">
                        Loading products...
                    </p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-slate-50 px-6 py-16">
                <div className="mx-auto max-w-7xl">
                    <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-600">
                        {error}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50">

            {/* Header */}

            <section className="border-b border-slate-200 bg-white">

                <div className="mx-auto max-w-7xl px-6 py-12">

                    <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                        E-cart STORE
                    </p>

                    <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
                        Our Products
                    </h1>

                    <p className="mt-3 max-w-2xl text-slate-500">
                        Discover quality products at affordable
                        prices.
                    </p>

                </div>

            </section>

            {/* Products */}

            <section className="mx-auto max-w-7xl px-6 py-12">

                {message && (
                    <div className="mb-8 rounded-xl border border-green-200 bg-green-50 px-5 py-4 font-medium text-green-700">
                        {message}
                    </div>
                )}

                {products.length === 0 ? (
                    <div className="rounded-xl bg-white p-10 text-center shadow-sm">
                        <p className="text-lg text-slate-500">
                            No products available.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                        {products.map((product) => (

                            <div
                                key={product.id}
                                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >

                                {/* Image */}

                                <div className="relative flex h-64 items-center justify-center overflow-hidden bg-slate-100">

                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-full w-full object-contain p-6 transition duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="text-slate-400">
                                            No Image
                                        </div>
                                    )}

                                    {product.stock > 0 && (
                                        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-green-600 shadow">
                                            In Stock
                                        </span>
                                    )}

                                    {product.stock <= 0 && (
                                        <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
                                            Out of Stock
                                        </span>
                                    )}

                                </div>

                                {/* Content */}

                                <div className="p-5">

                                    <h2 className="text-xl font-bold text-slate-900">
                                        {product.name}
                                    </h2>

                                    <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                                        {product.description}
                                    </p>

                                    <div className="mt-4 flex items-center justify-between">

                                        <span className="text-2xl font-extrabold text-slate-900">
                                            ₹{product.price}
                                        </span>

                                        <span className="text-sm text-slate-500">
                                            Stock: {product.stock}
                                        </span>

                                    </div>

                                    <button
                                        onClick={() =>
                                            addToCart(product.id)
                                        }
                                        disabled={product.stock <= 0}
                                        className="mt-5 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                                    >
                                        {product.stock > 0
                                            ? "Add to Cart"
                                            : "Out of Stock"}
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>
                )}

            </section>

        </main>
    );
}

export default Products;