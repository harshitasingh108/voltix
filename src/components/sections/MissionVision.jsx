const MissionVision = () => {
    return (
        <section className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center mb-16">
                    <p className="uppercase tracking-[4px] text-blue-600 font-semibold">
                        Our Purpose
                    </p>

                    <h2 className="mt-4 text-5xl font-bold text-slate-900">
                        Mission & Vision
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8">

                    {/* Mission */}

                    <div className="bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition">

                        <div className="text-5xl">🎯</div>

                        <h3 className="mt-6 text-3xl font-bold text-slate-900">
                            Our Mission
                        </h3>

                        <p className="mt-5 text-slate-600 leading-8">
                            To build intelligent, sustainable and accessible EV charging
                            infrastructure that accelerates the adoption of electric
                            mobility.
                        </p>

                    </div>

                    {/* Vision */}

                    <div className="bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition">

                        <div className="text-5xl">🚀</div>

                        <h3 className="mt-6 text-3xl font-bold text-slate-900">
                            Our Vision
                        </h3>

                        <p className="mt-5 text-slate-600 leading-8">
                            To become the world's most trusted smart charging network,
                            creating a greener and cleaner future for everyone.
                        </p>

                    </div>

                </div>

            </div>
        </section>
    );
};

export default MissionVision;