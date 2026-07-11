import aboutImage from "../../assets/images/about.jpg";

const AboutHero = () => {
    return (
        <section className="pt-32 pb-20 bg-gradient-to-b from-white via-slate-50 to-white">

            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center">

                    <p className="uppercase tracking-[5px] text-blue-600 font-semibold">
                        About Us
                    </p>

                    <h1 className="mt-5 text-6xl font-bold text-slate-900">
                        Driving Tomorrow's
                        <span className="block text-blue-600">
                            EV Revolution
                        </span>
                    </h1>

                    <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-600 leading-8">
                        Voltix delivers intelligent EV charging solutions with
                        cutting-edge technology, sustainability and seamless
                        charging experiences.
                    </p>

                </div>

                <img
                    src={aboutImage}
                    alt="About"
                    className="mt-16 h-[600px] w-full rounded-[30px] object-cover shadow-2xl"
                />

            </div>

        </section>
    );
};

export default AboutHero;