const WhyChoose = () => {
    return (
        <section className="py-24 bg-white">

            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center">

                    <p className="uppercase tracking-[4px] text-blue-600 font-semibold">
                        Why Choose Voltix
                    </p>

                    <h2 className="mt-4 text-5xl font-bold text-slate-900">
                        What Makes Us Different
                    </h2>

                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">

                    <div className="rounded-3xl bg-slate-50 p-8 text-center hover:-translate-y-2 transition shadow-md">
                        <h3 className="text-4xl">⚡</h3>
                        <h4 className="mt-5 text-xl font-bold">AI Powered</h4>
                        <p className="mt-3 text-slate-600">
                            Intelligent energy optimization.
                        </p>
                    </div>

                    <div className="rounded-3xl bg-slate-50 p-8 text-center hover:-translate-y-2 transition shadow-md">
                        <h3 className="text-4xl">🔋</h3>
                        <h4 className="mt-5 text-xl font-bold">Fast Charging</h4>
                        <p className="mt-3 text-slate-600">
                            High-speed charging technology.
                        </p>
                    </div>

                    <div className="rounded-3xl bg-slate-50 p-8 text-center hover:-translate-y-2 transition shadow-md">
                        <h3 className="text-4xl">🛡️</h3>
                        <h4 className="mt-5 text-xl font-bold">Secure</h4>
                        <p className="mt-3 text-slate-600">
                            Safe payments and protection.
                        </p>
                    </div>

                    <div className="rounded-3xl bg-slate-50 p-8 text-center hover:-translate-y-2 transition shadow-md">
                        <h3 className="text-4xl">🌍</h3>
                        <h4 className="mt-5 text-xl font-bold">Eco Friendly</h4>
                        <p className="mt-3 text-slate-600">
                            Sustainable charging solutions.
                        </p>
                    </div>

                </div>

            </div>

        </section>
    );
};

export default WhyChoose;