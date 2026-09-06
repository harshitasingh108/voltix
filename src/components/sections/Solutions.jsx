import { Link } from "react-router-dom";
import dcCharger from "../../assets/images/dc-charger.png";
import wallCharger from "../../assets/images/wall-charger.png";
import station from "../../assets/images/charging-station.png";

const solutions = [
    {
        image: dcCharger,
        title: "DC Fast Charger",
        description:
            "Ultra-fast charging solutions designed for highways and commercial charging stations.",
        link: "/solutions"
    },
    {
        image: wallCharger,
        title: "Smart AC Charger",
        description:
            "Compact and intelligent AC chargers perfect for homes, offices and apartments.",
        link: "/solutions"
    },
    {
        image: station,
        title: "Charging Network",
        description:
            "Reliable EV charging infrastructure with real-time monitoring and smart connectivity.",
        link: "/solutions"
    },
];

const Solutions = () => {
    return (
        <section className="bg-white py-20 lg:py-24 border-b border-slate-100">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Heading */}
                <div className="mx-auto mb-12 lg:mb-16 max-w-3xl text-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[2px] text-blue-600 shadow-sm">
                        ⚡ OUR SOLUTIONS
                    </span>

                    <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-heading font-bold tracking-tight leading-tight text-slate-900">
                        Powering Every{" "}
                        <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            Electric Journey
                        </span>
                    </h2>

                    <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"></div>

                    <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600">
                        Discover intelligent EV charging solutions engineered for homes,
                        businesses and commercial infrastructure with speed, reliability
                        and seamless connectivity.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {solutions.map((item, index) => (
                        <div
                            key={index}
                            className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-400/60 hover:shadow-xl flex flex-col justify-between motion-reduce:transform-none"
                        >
                            <div>
                                <div className="flex justify-center overflow-hidden py-2">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="h-48 sm:h-52 object-contain transition duration-500 group-hover:scale-105 motion-reduce:transform-none"
                                    />
                                </div>

                                <h3 className="mt-6 text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                    {item.title}
                                </h3>

                                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                                    {item.description}
                                </p>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100">
                                <Link
                                    to={item.link}
                                    className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 transition-all duration-300 group-hover:translate-x-1"
                                >
                                    Learn More →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Solutions;