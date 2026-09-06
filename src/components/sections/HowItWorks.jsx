import { Link } from "react-router-dom";
import { MapPin, Route, Sparkles, Zap, ArrowRight } from "lucide-react";

const steps = [
    {
        number: "01",
        title: "Discover",
        description: "Find charging stations along your route.",
        icon: MapPin,
        tag: "Location Search",
    },
    {
        number: "02",
        title: "Plan",
        description: "Choose a charging stop based on your journey.",
        icon: Route,
        tag: "Route Mapping",
    },
    {
        number: "03",
        title: "Predict",
        description: "Use AI-assisted demand prediction to compare options.",
        icon: Sparkles,
        tag: "AI Analytics",
    },
    {
        number: "04",
        title: "Charge",
        description: "Choose a smarter charging stop and continue your journey.",
        icon: Zap,
        tag: "Smart Selection",
    },
];

const HowItWorks = () => {
    return (
        <section className="bg-slate-50/70 py-20 lg:py-24 border-y border-slate-200/60 relative overflow-hidden">
            {/* Background subtle radial glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="mx-auto max-w-3xl text-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[2px] text-blue-600 shadow-sm">
                        ⚡ HOW VOLTIX WORKS
                    </span>

                    <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-heading font-bold tracking-tight text-slate-900">
                        From Route to{" "}
                        <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            Recharge
                        </span>
                    </h2>

                    <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600 max-w-2xl mx-auto">
                        VOLTIX connects route planning, charging-station discovery and AI-assisted demand insights into one simple experience.
                    </p>
                </div>

                {/* Steps Container */}
                <div className="mt-14 lg:mt-16 relative">

                    {/* Connecting Line - Desktop Only */}
                    <div className="hidden lg:block absolute top-[52px] left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-blue-200 via-cyan-300 to-blue-200 -z-0" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {steps.map((step, idx) => {
                            const IconComponent = step.icon;
                            return (
                                <div
                                    key={idx}
                                    className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-400/60 hover:shadow-xl hover:shadow-blue-500/5 z-10"
                                >
                                    <div>
                                        {/* Step Number & Icon Header */}
                                        <div className="flex items-center justify-between mb-5">
                                            <span className="text-2xl font-black font-heading text-blue-600/80 tracking-tight">
                                                {step.number}
                                            </span>
                                            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white shadow-sm">
                                                <IconComponent size={22} />
                                            </div>
                                        </div>

                                        {/* Step Tag */}
                                        <span className="inline-block px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 rounded-md mb-3">
                                            {step.tag}
                                        </span>

                                        {/* Title */}
                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                            {step.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Section CTA Action */}
                <div className="mt-12 sm:mt-14 text-center">
                    <Link
                        to="/smart-charge"
                        className="inline-flex items-center gap-2.5 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        Explore SmartCharge
                        <ArrowRight size={16} />
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default HowItWorks;
