import { Link } from "react-router-dom";
import heroVideo from "../../assets/videos/hero.mp4";
import { Sparkles, ArrowRight } from "lucide-react";

const Hero = () => {
    return (
        <section className="relative mt-24 sm:mt-28 mx-3 sm:mx-6 h-[calc(100vh-110px)] min-h-[520px] max-h-[720px] overflow-hidden rounded-2xl sm:rounded-[32px] shadow-2xl">

            {/* Background Video */}
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
            >
                <source src={heroVideo} type="video/mp4" />
            </video>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20" />

            {/* Bottom Gradient */}
            <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-white via-white/10 to-transparent" />

            {/* Hero Content */}
            <div className="absolute left-5 sm:left-10 md:left-16 top-1/2 max-w-xl -translate-y-1/2 text-white pr-4">

                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/20 px-3.5 py-1.5 backdrop-blur-md">
                    <Sparkles size={14} className="text-cyan-400" />
                    <span className="text-[11px] font-bold tracking-wider uppercase text-blue-200">
                        Smartcharge AI Active
                    </span>
                </div>

                <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-extrabold leading-tight tracking-tight">
                    Charge Smarter.
                    <br />
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                        Drive Further.
                    </span>
                </h1>

                <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg leading-relaxed text-slate-200 max-w-lg">
                    Discover intelligent EV charging stations with AI-powered demand prediction, route recommendations, and a premium charging experience.
                </p>

                <div className="mt-8 sm:mt-10 flex flex-wrap gap-3.5">
                    <Link
                        to="/smart-charge"
                        className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition duration-300 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <span>Find Station</span>
                        <ArrowRight size={16} />
                    </Link>

                    <Link
                        to="/solutions"
                        className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-white backdrop-blur-md transition duration-300 hover:bg-white/20 hover:-translate-y-0.5"
                    >
                        Explore Solutions
                    </Link>
                </div>

            </div>

        </section>
    );
};

export default Hero;