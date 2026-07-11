const Services = () => {
    return (
        <main className="pt-32">

            {/* Hero */}

            <section className="bg-gradient-to-b from-blue-50 via-white to-white py-24">

                <div className="max-w-7xl mx-auto px-6 text-center">

                    <p className="uppercase tracking-[4px] text-blue-600 font-semibold">
                        SaaS Services
                    </p>

                    <h1 className="mt-5 text-6xl font-bold text-slate-900">
                        Smart Software For
                        <span className="block text-blue-600">
                            EV Infrastructure
                        </span>
                    </h1>

                    <p className="mt-8 max-w-3xl mx-auto text-lg text-slate-600 leading-8">
                        Manage charging stations, monitor performance,
                        track analytics and control your EV ecosystem
                        from one intelligent dashboard.
                    </p>

                </div>

            </section>

            {/* Services */}

            <section className="py-24 bg-white">

                <div className="max-w-7xl mx-auto px-6">

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

                        <div className="rounded-3xl bg-slate-50 p-8 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition">
                            <div className="text-5xl">📊</div>
                            <h3 className="mt-6 text-2xl font-bold">Analytics</h3>
                            <p className="mt-4 text-slate-600">
                                Monitor charging performance with real-time insights.
                            </p>
                        </div>

                        <div className="rounded-3xl bg-slate-50 p-8 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition">
                            <div className="text-5xl">📱</div>
                            <h3 className="mt-6 text-2xl font-bold">Mobile App</h3>
                            <p className="mt-4 text-slate-600">
                                Manage charging stations from anywhere.
                            </p>
                        </div>

                        <div className="rounded-3xl bg-slate-50 p-8 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition">
                            <div className="text-5xl">⚙️</div>
                            <h3 className="mt-6 text-2xl font-bold">Smart Monitoring</h3>
                            <p className="mt-4 text-slate-600">
                                Live monitoring with AI-powered alerts.
                            </p>
                        </div>

                        <div className="rounded-3xl bg-slate-50 p-8 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition">
                            <div className="text-5xl">☁️</div>
                            <h3 className="mt-6 text-2xl font-bold">Cloud Platform</h3>
                            <p className="mt-4 text-slate-600">
                                Secure cloud infrastructure with 24×7 access.
                            </p>
                        </div>

                    </div>

                </div>

            </section>

        </main>
    );
};

export default Services;