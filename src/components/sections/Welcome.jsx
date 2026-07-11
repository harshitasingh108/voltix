import aboutImage from "../../assets/images/about.jpg";

const Welcome = () => {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">

                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left Image */}

                    <div className="relative">

                        <img
                            src={aboutImage}
                            alt="Welcome"
                            className="rounded-[30px] shadow-2xl w-full h-[500px] object-cover"
                        />

                        <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white rounded-2xl p-6 shadow-xl">

                            <h3 className="text-3xl font-bold">120+</h3>

                            <p className="text-sm">Charging Stations</p>

                        </div>

                    </div>

                    {/* Right Content */}

                    <div>

                        <p className="uppercase tracking-[4px] text-blue-600 font-semibold">

                            Welcome To Voltix

                        </p>

                        <h2 className="mt-5 text-5xl font-bold text-slate-900 leading-tight">

                            Smart Charging For

                            <span className="block text-blue-600">

                                A Greener Future

                            </span>

                        </h2>

                        <p className="mt-6 text-lg leading-8 text-slate-600">

                            Voltix delivers next-generation EV charging
                            infrastructure with intelligent technology,
                            fast charging capabilities and secure
                            connectivity designed for the future.

                        </p>

                        <div className="mt-10 grid grid-cols-2 gap-5">

                            <div className="rounded-xl bg-slate-50 p-4">
                                ✅ AI Powered
                            </div>

                            <div className="rounded-xl bg-slate-50 p-4">
                                ✅ Fast Charging
                            </div>

                            <div className="rounded-xl bg-slate-50 p-4">
                                ✅ Smart Monitoring
                            </div>

                            <div className="rounded-xl bg-slate-50 p-4">
                                ✅ Secure Payments
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
};

export default Welcome;
