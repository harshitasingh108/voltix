import {
    Zap,
    BatteryCharging,
    Smartphone,
    ShieldCheck,
} from "lucide-react";

import charger from "../../assets/images/dc-charger.png";

const Features = () => {
    return (
        <section className="bg-white py-28">

            {/* Heading */}

            <div className="mx-auto mb-20 max-w-3xl text-center">

                <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold uppercase tracking-widest text-blue-600">

                    WHY CHOOSE VOLTIX

                </span>

                <h2 className="mt-6 text-5xl font-heading font-bold text-slate-900">

                    Smart Features For
                    <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                        Modern EV Charging
                    </span>

                </h2>

                <p className="mt-6 text-lg leading-8 text-slate-600">

                    Built with intelligent technology to deliver
                    fast, secure and reliable charging experiences.

                </p>

            </div>

            {/* Features */}

            <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-3">

                {/* Left */}

                <div className="space-y-8">

                    <FeatureCard
                        icon={<Zap size={34} />}
                        title="AI Monitoring"
                        text="Real-time monitoring and intelligent energy optimization."
                    />

                    <FeatureCard
                        icon={<BatteryCharging size={34} />}
                        title="Fast Charging"
                        text="Ultra-fast charging with maximum efficiency."
                    />

                </div>

                {/* Center */}

                <div className="relative flex justify-center">

                    <div className="absolute h-72 w-72 rounded-full bg-blue-200 blur-3xl opacity-40"></div>

                    <img
                        src={charger}
                        alt="EV Charger"
                        className="relative h-[520px] transition duration-500 hover:-translate-y-3"
                    />

                </div>

                {/* Right */}

                <div className="space-y-8">

                    <FeatureCard
                        icon={<Smartphone size={34} />}
                        title="Mobile App"
                        text="Control and monitor charging stations remotely."
                    />

                    <FeatureCard
                        icon={<ShieldCheck size={34} />}
                        title="Secure Payments"
                        text="Safe digital payments with enterprise-grade security."
                    />

                </div>

            </div>

        </section>
    );
};

function FeatureCard({ icon, title, text }) {
    return (
        <div className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-lg transition duration-500 hover:-translate-y-3 hover:border-blue-300 hover:shadow-2xl">

            <div className="mb-5 inline-flex rounded-2xl bg-blue-100 p-4 text-blue-600 transition group-hover:scale-110">

                {icon}

            </div>

            <h3 className="text-2xl font-bold text-slate-900">

                {title}

            </h3>

            <p className="mt-4 leading-7 text-slate-600">

                {text}

            </p>

        </div>
    );
}

export default Features;