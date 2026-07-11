import { useEffect, useState } from "react";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <header
            className={`fixed left-1/2 top-5 z-50 w-[92%] max-w-7xl -translate-x-1/2 transition-all duration-500 ${scrolled
                    ? "bg-white/85 backdrop-blur-xl shadow-xl border border-slate-200"
                    : "bg-white/60 backdrop-blur-xl border border-white/60"
                } rounded-full`}
        >
            <nav className="flex h-20 items-center justify-between px-8">

                {/* Logo */}

                <div className="flex items-center gap-3 cursor-pointer">

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg">

                        <span className="text-xl text-white">⚡</span>

                    </div>

                    <div>

                        <h1 className="font-heading text-2xl font-bold tracking-wide text-slate-900">

                            VOLT<span className="text-blue-600">RIX</span>

                        </h1>

                        <p className="text-xs text-slate-500 -mt-1">

                            Smart EV Charging

                        </p>

                    </div>

                </div>

                {/* Menu */}

                <ul className="hidden lg:flex items-center gap-10 font-medium text-slate-700">

                    <li className="cursor-pointer transition hover:text-blue-600">
                        Home
                    </li>

                    <li className="cursor-pointer transition hover:text-blue-600">
                        Stations
                    </li>

                    <li className="cursor-pointer transition hover:text-blue-600">
                        Features
                    </li>

                    <li className="cursor-pointer transition hover:text-blue-600">
                        Pricing
                    </li>

                    <li className="cursor-pointer transition hover:text-blue-600">
                        Contact
                    </li>

                </ul>

                {/* Button */}

                <button className="hidden lg:block rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-3 font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-blue-300">

                    Find Station →

                </button>

            </nav>
        </header>
    );
};

export default Navbar;