import heroVideo from "../../assets/videos/hero.mp4";

const Hero = () => {
    return (
        <section className="relative mt-28 mx-6 h-[calc(100vh-120px)] overflow-hidden rounded-[32px] shadow-2xl">

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

            <div className="absolute inset-0 bg-black/25"></div>

            {/* Bottom Gradient */}

            <div className="absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-white via-white/20 to-transparent"></div>

            {/* Hero Content */}

            <div className="absolute left-16 top-1/2 max-w-xl -translate-y-1/2 text-white">

                <p className="mb-3 text-blue-300 font-semibold tracking-widest uppercase">
                    Smart EV Charging
                </p>

                <h1 className="text-6xl font-heading font-bold leading-tight">
                    Charge Smarter.
                    <br />
                    Drive Further.
                </h1>

                <p className="mt-6 text-lg leading-8 text-slate-200">
                    Discover intelligent EV charging stations with real-time
                    availability, seamless payments and a premium charging experience.
                </p>

                <div className="mt-10 flex gap-5">

                    <button className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-4 font-semibold transition duration-300 hover:scale-105">

                        Find Station →

                    </button>

                    <button className="rounded-full border border-white/40 bg-white/10 px-8 py-4 font-semibold backdrop-blur-md transition duration-300 hover:bg-white/20">

                        ▶ Watch Demo

                    </button>

                </div>

            </div>

        </section>
    );
};

export default Hero;