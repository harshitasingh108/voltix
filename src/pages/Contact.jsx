const Contact = () => {
    return (
        <main className="pt-32">

            {/* Hero */}

            <section className="bg-gradient-to-b from-blue-50 via-white to-white py-24">

                <div className="max-w-7xl mx-auto px-6 text-center">

                    <p className="uppercase tracking-[4px] text-blue-600 font-semibold">
                        Contact Us
                    </p>

                    <h1 className="mt-5 text-6xl font-bold text-slate-900">
                        Let's Build the Future
                        <span className="block text-blue-600">
                            Together
                        </span>
                    </h1>

                    <p className="mt-8 max-w-3xl mx-auto text-lg leading-8 text-slate-600">
                        Have questions about EV charging solutions? Our team is here to help you with the right charging infrastructure.
                    </p>

                </div>

            </section>

            {/* Contact Section */}

            <section className="py-24 bg-white">

                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16">

                    {/* Form */}

                    <div className="bg-slate-50 rounded-3xl p-10 shadow-lg">

                        <h2 className="text-3xl font-bold mb-8">
                            Send a Message
                        </h2>

                        <form className="space-y-6">

                            <input
                                type="text"
                                placeholder="Your Name"
                                className="w-full rounded-xl border p-4 outline-none focus:border-blue-500"
                            />

                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full rounded-xl border p-4 outline-none focus:border-blue-500"
                            />

                            <input
                                type="text"
                                placeholder="Subject"
                                className="w-full rounded-xl border p-4 outline-none focus:border-blue-500"
                            />

                            <textarea
                                rows="6"
                                placeholder="Your Message"
                                className="w-full rounded-xl border p-4 outline-none focus:border-blue-500"
                            ></textarea>

                            <button className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-4 text-white font-semibold hover:scale-105 transition">
                                Send Message
                            </button>

                        </form>

                    </div>

                    {/* Contact Details */}

                    <div>

                        <h2 className="text-3xl font-bold">
                            Get In Touch
                        </h2>

                        <p className="mt-6 text-slate-600 leading-8">
                            We'd love to hear from you. Reach out for partnerships,
                            business inquiries or technical support.
                        </p>

                        <div className="mt-10 space-y-8">

                            <div className="rounded-2xl bg-slate-50 p-6 shadow">

                                <h3 className="font-bold text-xl">
                                    📍 Address
                                </h3>

                                <p className="mt-2 text-slate-600">
                                    XX Business Park<br />
                                    New Delhi, India
                                </p>

                            </div>

                            <div className="rounded-2xl bg-slate-50 p-6 shadow">

                                <h3 className="font-bold text-xl">
                                    📞 Phone
                                </h3>

                                <p className="mt-2 text-slate-600">
                                    +91 XXXXX XXXXX
                                </p>

                            </div>

                            <div className="rounded-2xl bg-slate-50 p-6 shadow">

                                <h3 className="font-bold text-xl">
                                    ✉ Email
                                </h3>

                                <p className="mt-2 text-slate-600">
                                    support@voltrix.com
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

        </main>
    );
};

export default Contact;