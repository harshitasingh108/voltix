import dcCharger from "../../assets/images/dc-charger.png";
import wallCharger from "../../assets/images/wall-charger.png";
import station from "../../assets/images/charging-station.png";

const solutions = [
    {
        image: dcCharger,
        title: "DC Fast Charger",
        description:
            "Ultra-fast charging solutions designed for highways and commercial charging stations.",
    },
    {
        image: wallCharger,
        title: "Smart AC Charger",
        description:
            "Compact and intelligent AC chargers perfect for homes, offices and apartments.",
    },
    {
        image: station,
        title: "Charging Network",
        description:
            "Reliable EV charging infrastructure with real-time monitoring and smart connectivity.",
    },
];

const Solutions = () => {
    return (
        <section className="bg-white py-28">

            {/* Heading */}

            <div className="mx-auto mb-20 max-w-3xl text-center">

                <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-6 py-3 text-sm font-semibold uppercase tracking-[3px] text-blue-600 shadow-md">

                    ⚡ OUR SOLUTIONS

                </span>

                <h2 className="mt-7 text-5xl font-heading font-bold leading-tight text-slate-900">

                    Powering Every{" "}

                    <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">

                        Electric Journey

                    </span>

                </h2>

                <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"></div>

                <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-600">

                    Discover intelligent EV charging solutions engineered for homes,
                    businesses and commercial infrastructure with speed, reliability
                    and seamless connectivity.

                </p>

            </div>

            {/* Cards */}

            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 md:grid-cols-2 lg:grid-cols-3">

                {solutions.map((item, index) => (

                    <div
                        key={index}
                        className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white p-8 shadow-lg transition-all duration-500 hover:-translate-y-4 hover:border-blue-300 hover:shadow-2xl"
                    >

                        <div className="flex justify-center overflow-hidden">

                            <img
                                src={item.image}
                                alt={item.title}
                                className="h-56 object-contain transition duration-500 group-hover:scale-110"
                            />

                        </div>

                        <h3 className="mt-8 text-2xl font-bold text-slate-900">

                            {item.title}

                        </h3>

                        <p className="mt-4 leading-7 text-slate-600">

                            {item.description}

                        </p>

                        <button className="mt-8 font-semibold text-blue-600 transition-all duration-300 group-hover:translate-x-2">

                            Learn More →

                        </button>

                    </div>

                ))}

            </div>

        </section>
    );
};

export default Solutions;