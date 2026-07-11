import charger from "../assets/images/dc-charger.png";
import wall from "../assets/images/wall-charger.png";
import station from "../assets/images/charging-station.png";

const Solutions = () => {
    return (
        <main className="pt-32">

            {/* Hero */}

            <section className="bg-gradient-to-b from-blue-50 via-white to-white py-24">

                <div className="max-w-7xl mx-auto px-6 text-center">

                    <p className="uppercase tracking-[4px] text-blue-600 font-semibold">
                        EV Charging Solutions
                    </p>

                    <h1 className="mt-5 text-6xl font-bold text-slate-900">
                        Intelligent Charging
                        <span className="block text-blue-600">
                            For Every Journey
                        </span>
                    </h1>

                    <p className="mt-8 max-w-3xl mx-auto text-lg leading-8 text-slate-600">
                        Explore our complete range of EV charging products
                        designed for homes, businesses and public charging
                        infrastructure.
                    </p>

                </div>

            </section>

            {/* Cards */}

            <section className="py-24 bg-white">

                <div className="max-w-7xl mx-auto px-6">

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">

                        <div className="bg-slate-50 rounded-[28px] p-8 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition">

                            <img
                                src={charger}
                                alt=""
                                className="h-64 mx-auto object-contain"
                            />

                            <h2 className="mt-8 text-2xl font-bold text-slate-900">

                                DC Fast Charger

                            </h2>

                            <p className="mt-4 text-slate-600 leading-7">

                                High-speed charging stations for highways,
                                commercial spaces and smart cities.

                            </p>

                        </div>

                        <div className="bg-slate-50 rounded-[28px] p-8 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition">

                            <img
                                src={wall}
                                alt=""
                                className="h-64 mx-auto object-contain"
                            />

                            <h2 className="mt-8 text-2xl font-bold text-slate-900">

                                Smart AC Charger

                            </h2>

                            <p className="mt-4 text-slate-600 leading-7">

                                Reliable home and office charging with
                                intelligent energy management.

                            </p>

                        </div>

                        <div className="bg-slate-50 rounded-[28px] p-8 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition">

                            <img
                                src={station}
                                alt=""
                                className="h-64 mx-auto object-contain"
                            />

                            <h2 className="mt-8 text-2xl font-bold text-slate-900">

                                Charging Network

                            </h2>

                            <p className="mt-4 text-slate-600 leading-7">

                                Connected EV charging infrastructure with
                                live monitoring and analytics.

                            </p>

                        </div>

                    </div>

                </div>

            </section>

        </main>
    );
};

export default Solutions;