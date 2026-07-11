import { ArrowRight, MapPinned } from "lucide-react";

const CTA = () => {
    return (
        <section className="py-28 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700">

            <div className="mx-auto max-w-6xl px-6">

                <div className="rounded-[32px] bg-white/10 backdrop-blur-xl border border-white/20 p-16 text-center shadow-2xl">

                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-blue-600 shadow-xl">

                        <MapPinned size={38} />

                    </div>

                    <h2 className="mt-8 text-5xl font-heading font-bold text-white">

                        Ready to Power
                        <br />
                        Your EV Journey?

                    </h2>

                    <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-blue-100">

                        Experience intelligent charging infrastructure with
                        faster charging, real-time monitoring and seamless
                        connectivity designed for the future.

                    </p>

                    <div className="mt-12 flex flex-wrap justify-center gap-6">

                        <button className="rounded-full bg-white px-8 py-4 font-semibold text-blue-700 shadow-xl transition duration-300 hover:-translate-y-1 hover:scale-105">

                            Find Station

                        </button>

                        <button className="flex items-center gap-3 rounded-full border border-white px-8 py-4 font-semibold text-white transition duration-300 hover:bg-white hover:text-blue-700">

                            Contact Us

                            <ArrowRight size={20} />

                        </button>

                    </div>

                </div>

            </div>

        </section>
    );
};

export default CTA;