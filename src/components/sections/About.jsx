import aboutImage from "../../assets/images/about.jpg";

const About = () => {
    return (
        <section className="bg-slate-50 py-28">

            <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-20 px-6 lg:grid-cols-2">

                {/* Left Side Image */}

                <div className="relative group">

                    {/* Glow */}

                    <div className="absolute -inset-4 rounded-[32px] bg-blue-400/20 blur-3xl transition duration-500 group-hover:bg-blue-500/30"></div>

                    <div className="relative overflow-hidden rounded-[32px] shadow-2xl">

                        <img
                            src={aboutImage}
                            alt="About Voltix"
                            className="h-[550px] w-full object-cover transition duration-700 group-hover:scale-105"
                        />

                    </div>

                    {/* Floating Card */}

                    <div className="absolute -right-6 bottom-8 rounded-2xl bg-white p-5 shadow-xl">

                        <h3 className="text-3xl font-bold text-blue-600">

                            120+

                        </h3>

                        <p className="text-sm text-slate-600">

                            Charging Stations

                        </p>

                    </div>

                </div>

                {/* Right Side */}

                <div>

                    {/* Badge */}

                    <span className="inline-flex rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold uppercase tracking-widest text-blue-600">

                        ⚡ Who We Are

                    </span>

                    {/* Heading */}

                    <h2 className="mt-6 text-5xl font-heading font-bold leading-tight text-slate-900">

                        Building the Future of

                        <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">

                            EV Charging

                        </span>

                    </h2>

                    {/* Description */}

                    <p className="mt-8 text-lg leading-8 text-slate-600">

                        Voltix delivers intelligent EV charging solutions with
                        real-time monitoring, seamless connectivity and
                        reliable infrastructure designed for homes,
                        businesses and public charging stations.

                    </p>

                    {/* Features */}

                    <div className="mt-10 grid gap-5">

                        <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl">

                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl">

                                ⚡

                            </div>

                            <div>

                                <h3 className="font-bold text-slate-900">

                                    AI Powered Charging

                                </h3>

                                <p className="text-slate-600">

                                    Smart charging with intelligent energy management.

                                </p>

                            </div>

                        </div>

                        <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl">

                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl">

                                🔋

                            </div>

                            <div>

                                <h3 className="font-bold text-slate-900">

                                    Ultra Fast Charging

                                </h3>

                                <p className="text-slate-600">

                                    High-speed DC & AC charging for every journey.

                                </p>

                            </div>

                        </div>

                        <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl">

                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 text-xl">

                                🛡️

                            </div>

                            <div>

                                <h3 className="font-bold text-slate-900">

                                    Secure & Reliable

                                </h3>

                                <p className="text-slate-600">

                                    Safe payments with 24×7 monitoring and support.

                                </p>

                            </div>

                        </div>

                    </div>

                    {/* Button */}

                    <button className="mt-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-4 font-semibold text-white shadow-lg transition duration-300 hover:scale-105">

                        Learn More →

                    </button>

                </div>

            </div>

        </section>
    );
};

export default About;