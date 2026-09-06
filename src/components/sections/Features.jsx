import { Zap, BatteryCharging, Smartphone, ShieldCheck } from "lucide-react";
import charger from "../../assets/images/dc-charger.png";

const Features = () => {
    return (
        <section className="bg-white py-20 lg:py-24 relative overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Section Heading */}
                <div className="mx-auto max-w-3xl text-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[2px] text-blue-600 shadow-sm">
                        ⚡ WHY CHOOSE VOLTIX
                    </span>

                    <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-heading font-bold tracking-tight text-slate-900">
                        Smart Features for{" "}
                        <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            Modern EV Charging
                        </span>
                    </h2>

                    <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600 max-w-2xl mx-auto">
                        Intelligent technology designed to make EV charging simpler, smarter and more reliable.
                    </p>
                </div>

                {/* Balanced Feature Layout */}
                <div className="mt-14 lg:mt-16 grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-8">

                    {/* Left Column - 2 Feature Cards */}
                    <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
                        <FeatureCard
                            icon={<Zap size={22} />}
                            title="AI Monitoring"
                            description="Real-time insights for smarter charging operations."
                        />

                        <FeatureCard
                            icon={<Smartphone size={22} />}
                            title="Mobile App"
                            description="Monitor and manage charging stations from anywhere."
                        />
                    </div>

                    {/* Center Column - Integrated Charger Visual */}
                    <div className="lg:col-span-4 flex justify-center items-center py-4 lg:py-0 order-1 lg:order-2">
                        <div className="relative flex justify-center items-center w-full max-w-[320px] sm:max-w-[360px] lg:max-w-none">
                            {/* Soft radial backdrop circle */}
                            <div className="absolute inset-0 m-auto h-[260px] w-[260px] sm:h-[300px] sm:w-[300px] rounded-full bg-gradient-to-tr from-blue-100/80 via-cyan-100/50 to-blue-50/20 blur-2xl opacity-70 pointer-events-none -z-0" />

                            <img
                                src={charger}
                                alt="VOLTIX EV Charger"
                                className="relative z-10 max-h-[300px] sm:max-h-[360px] lg:max-h-[420px] w-auto object-contain transition-transform duration-500 hover:scale-105 motion-reduce:transform-none"
                            />
                        </div>
                    </div>

                    {/* Right Column - 2 Feature Cards */}
                    <div className="lg:col-span-4 space-y-6 order-3">
                        <FeatureCard
                            icon={<BatteryCharging size={22} />}
                            title="Fast Charging"
                            description="High-speed charging designed for reduced waiting time."
                        />

                        <FeatureCard
                            icon={<ShieldCheck size={22} />}
                            title="Secure Payments"
                            description="Protected digital payments for seamless charging."
                        />
                    </div>

                </div>

            </div>
        </section>
    );
};

function FeatureCard({ icon, title, description }) {
    return (
        <div className="group relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/60 hover:shadow-xl hover:shadow-blue-500/5 motion-reduce:transform-none">
            <div className="flex items-start gap-4">
                {/* Compact Icon Container */}
                <div className="shrink-0 p-3 rounded-xl bg-blue-50 text-blue-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white shadow-sm">
                    {icon}
                </div>

                <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Features;