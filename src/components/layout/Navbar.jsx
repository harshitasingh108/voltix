import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinkStyle = ({ isActive }) =>
        isActive
            ? "text-blue-600 font-semibold"
            : "text-slate-700 hover:text-blue-600 transition duration-300";

    return (
        <header
            className={`fixed left-1/2 top-5 z-50 w-[92%] max-w-7xl -translate-x-1/2 rounded-full transition-all duration-500 ${scrolled
                    ? "border border-slate-200 bg-white/90 shadow-xl backdrop-blur-xl"
                    : "border border-white/60 bg-white/70 backdrop-blur-xl"
                }`}
        >
            <nav className="flex h-20 items-center justify-between px-8">

                {/* Logo */}

                <NavLink to="/" className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg">

                        <span className="text-xl text-white">⚡</span>

                    </div>

                    <div>

                        <h1 className="font-heading text-2xl font-bold tracking-wide text-slate-900">

                            VOLT<span className="text-blue-600">RIX</span>

                        </h1>

                        <p className="-mt-1 text-xs text-slate-500">

                            Smart EV Charging

                        </p>

                    </div>

                </NavLink>

                {/* Menu */}

                <ul className="hidden items-center gap-10 font-medium lg:flex">

                    <li>
                        <NavLink to="/" className={navLinkStyle}>
                            Home
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/about" className={navLinkStyle}>
                            About
                        </NavLink>
                    </li>

                    {/* Solutions */}

                    <li className="group relative">

                        <NavLink to="/solutions" className={navLinkStyle}>
                            EV Solutions ▾
                        </NavLink>

                        <div className="absolute left-0 top-8 hidden w-64 rounded-2xl border border-slate-100 bg-white p-3 shadow-2xl group-hover:block">

                            <NavLink
                                to="/solutions"
                                className="block rounded-xl px-4 py-3 hover:bg-slate-100"
                            >
                                DC Fast Charging
                            </NavLink>

                            <NavLink
                                to="/solutions"
                                className="block rounded-xl px-4 py-3 hover:bg-slate-100"
                            >
                                AC Smart Charging
                            </NavLink>

                            <NavLink
                                to="/solutions"
                                className="block rounded-xl px-4 py-3 hover:bg-slate-100"
                            >
                                Charging Network
                            </NavLink>

                        </div>

                    </li>

                    {/* Services */}

                    <li className="group relative">

                        <NavLink to="/services" className={navLinkStyle}>
                            SaaS Services ▾
                        </NavLink>

                        <div className="absolute left-0 top-8 hidden w-64 rounded-2xl border border-slate-100 bg-white p-3 shadow-2xl group-hover:block">

                            <NavLink
                                to="/services"
                                className="block rounded-xl px-4 py-3 hover:bg-slate-100"
                            >
                                Fleet Management
                            </NavLink>

                            <NavLink
                                to="/services"
                                className="block rounded-xl px-4 py-3 hover:bg-slate-100"
                            >
                                Smart Monitoring
                            </NavLink>

                            <NavLink
                                to="/services"
                                className="block rounded-xl px-4 py-3 hover:bg-slate-100"
                            >
                                Mobile App
                            </NavLink>

                            <NavLink
                                to="/services"
                                className="block rounded-xl px-4 py-3 hover:bg-slate-100"
                            >
                                Analytics Dashboard
                            </NavLink>

                        </div>

                    </li>

                    <li>
                        <NavLink to="/contact" className={navLinkStyle}>
                            Contact
                        </NavLink>
                    </li>

                </ul>

                {/* Button */}

                <NavLink to="/contact">

                    <button className="hidden rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-3 font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-blue-300 lg:block">

                        Get In Touch →

                    </button>

                </NavLink>

            </nav>
        </header>
    );
};

export default Navbar;