const Footer = () => {
    return (
        <footer className="bg-[#08111F] text-white">

            <div className="mx-auto max-w-7xl px-6 py-20">

                <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-4">

                    {/* Logo */}

                    <div>

                        <h2 className="text-4xl font-bold tracking-wide">

                            VOLT<span className="text-blue-500">RIX</span>

                        </h2>

                        <p className="mt-6 leading-7 text-slate-400">

                            Intelligent EV charging solutions built for homes,
                            businesses and public infrastructure.

                        </p>

                    </div>

                    {/* Quick Links */}

                    <div>

                        <h3 className="mb-6 text-xl font-semibold">

                            Quick Links

                        </h3>

                        <ul className="space-y-4 text-slate-400">

                            <li className="cursor-pointer hover:text-blue-400 transition">
                                Home
                            </li>

                            <li className="cursor-pointer hover:text-blue-400 transition">
                                About
                            </li>

                            <li className="cursor-pointer hover:text-blue-400 transition">
                                Solutions
                            </li>

                            <li className="cursor-pointer hover:text-blue-400 transition">
                                Features
                            </li>

                        </ul>

                    </div>

                    {/* Services */}

                    <div>

                        <h3 className="mb-6 text-xl font-semibold">

                            Services

                        </h3>

                        <ul className="space-y-4 text-slate-400">

                            <li>Fast DC Charging</li>

                            <li>Smart AC Charging</li>

                            <li>Charging Network</li>

                            <li>Fleet Management</li>

                        </ul>

                    </div>

                    {/* Contact */}

                    <div>

                        <h3 className="mb-6 text-xl font-semibold">

                            Contact

                        </h3>

                        <div className="space-y-5 text-slate-400">

                            <p>📍 New Delhi, India</p>

                            <p>📞 +91 XXXXX XXXXX</p>

                            <p>✉ support@voltrix.com</p>

                        </div>

                    </div>

                </div>

                <div className="mt-16 border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center">

                    <p className="text-slate-500">

                        © 2026 VOLTRIX. All Rights Reserved.

                    </p>

                    <p className="mt-4 md:mt-0 text-slate-500">

                        Designed & Developed by <span className="text-blue-400">Harshita</span>

                    </p>

                </div>

            </div>

        </footer>
    );
};

export default Footer;