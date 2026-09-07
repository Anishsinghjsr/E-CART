    import { Link } from "react-router-dom";

    function Home() {
        return (
            <main>

                <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">

                    <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-24 md:grid-cols-2">

                        <div>

                            <p className="text-sm font-bold uppercase tracking-widest text-indigo-200">
                                Welcome to
                            </p>

                            <h1 className="mt-4 text-5xl font-extrabold md:text-6xl">
                                E-cart
                                <br />
                                Store
                            </h1>

                            <p className="mt-6 max-w-xl text-lg text-indigo-100">
                                Discover quality products at affordable prices.
                                Shop easily, securely and quickly.
                            </p>

                            <Link
                                to="/products"
                                className="mt-8 inline-block rounded-xl bg-white px-7 py-3 font-bold text-indigo-600 shadow-lg hover:bg-slate-100"
                            >
                                Shop Now
                            </Link>

                        </div>

                        <div className="hidden md:block">

                            <div className="rounded-3xl bg-white/10 p-10 backdrop-blur">

                                <div className="rounded-2xl bg-white p-12 text-center text-slate-900">

                                    <div className="text-7xl">
                                        🛍️
                                    </div>

                                    <h2 className="mt-5 text-3xl font-extrabold">
                                        Shop Smart
                                    </h2>

                                    <p className="mt-3 text-slate-500">
                                        Quality products. Great prices.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>

                <section className="mx-auto max-w-7xl px-6 py-16">

                    <div className="grid gap-6 md:grid-cols-3">

                        <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
                            <div className="text-4xl">🚚</div>
                            <h3 className="mt-4 text-xl font-bold">
                                Fast Delivery
                            </h3>
                            <p className="mt-2 text-slate-500">
                                Quick and reliable delivery.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
                            <div className="text-4xl">🔒</div>
                            <h3 className="mt-4 text-xl font-bold">
                                Secure Shopping
                            </h3>
                            <p className="mt-2 text-slate-500">
                                Safe account and order management.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
                            <div className="text-4xl">⭐</div>
                            <h3 className="mt-4 text-xl font-bold">
                                Quality Products
                            </h3>
                            <p className="mt-2 text-slate-500">
                                Good products at affordable prices.
                            </p>
                        </div>

                    </div>

                </section>

            </main>
        );
    }

    export default Home;