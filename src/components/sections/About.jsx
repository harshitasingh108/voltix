import { Link } from "react-router-dom";
import aboutImage from "../../assets/images/about.jpg";

const About = () => {
    return (
        <section className="bg-slate-50 py-20 lg:py-24">
            <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:gap-16 px-4 sm:px-6 lg:px-8 lg:grid-cols-2">

                {/* Left Side Image */}
                <div className="relative group">
                    {/* Glow */}
                    <div className="absolute -inset-4 rounded-3xl bg-blue-400/20 blur-3xl transition duration-500 group-hover:bg-blue-500/30" />

                    <div className="relative overflow-hidden rounded-3xl shadow-xl border border-slate-200/60">
                        <img
                            src={aboutImage}
                            alt="About VOLTIX"
                            className="h-[360px] sm:h-[450px] lg:h-[500px] w-full object-cover transition duration-700 group-hover:scale-105 motion-reduce:transform-none"
                        />
                    </div>

                    {/* Floating Card */}
                    <div className="absolute -right-2 sm:-right-4 bottom-6 rounded-2xl bg-white/95 backdrop-blur-md p-4 sm:p-5 shadow-xl border border-slate-100">
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-blue-600">
                            120+
                        </h3>
                        <p className="text-xs font-semibold text-slate-600">
                            Charging Stations
                        </p>
                    </div>
                </div>

                {/* Right Side */}
                <div>
                    {/* Badge */}
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[2px] text-blue-600 shadow-sm">
                        ⚡ WHO WE ARE
                    </span>

                    {/* Heading */}
                    <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-heading font-bold leading-tight text-slate-900">
                        Building the Future of{" "}
                        <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            EV Charging
                        </span>
                    </h2>

                    {/* Description */}
                    <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600">
                        VOLTIX delivers intelligent EV charging solutions with AI-powered demand predictions, real-time monitoring, and reliable infrastructure designed for homes, businesses and public charging stations.
                    </p>

                    {/* Features */}
                    <div className="mt-6 space-y-3.5">
                        <div className="flex items-center gap-4 rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold text-base">
                                ⚡
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-slate-900">
                                    AI Powered Charging
                                </h3>
                                <p className="text-xs text-slate-600">
                                    Smart demand predictions with intelligent energy management.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold text-base">
                                🔋
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-slate-900">
                                    Ultra Fast Charging
                                </h3>
                                <p className="text-xs text-slate-600">
                                    High-speed DC & AC charging options for every journey.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 font-bold text-base">
                                🛡️
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-slate-900">
                                    Secure & Reliable
                                </h3>
                                <p className="text-xs text-slate-600">
                                    Enterprise-grade security with 24×7 monitoring.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Button */}
                    <div className="mt-8">
                        <Link
                            to="/about"
                            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5"
                        >
                            Learn More About Us →
                        </Link>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default About;