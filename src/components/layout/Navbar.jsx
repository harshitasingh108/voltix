import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 30);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navStyle = ({ isActive }) =>
        `relative transition duration-300 ${isActive
            ? "text-blue-600 font-semibold"
            : "text-slate-700 hover:text-blue-600"
        }`;

    return (
        <header
            className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-7xl rounded-full transition-all duration-500 ${scrolled
                    ? "bg-white/90 backdrop-blur-xl shadow-2xl border border-slate-200"
                    : "bg-white/70 backdrop-blur-xl border border-white/60"
                }`}
        >
            <nav className="flex h-20 items-center justify-between px-8">

                {/* Logo */}

                <NavLink to="/" className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg">

                        <span className="text-xl text-white">⚡</span>

                    </div>

                    <div>

                        <h1 className="text-2xl font-bold tracking-wide text-slate-900">
                            VOLT<span className="text-blue-600">RIX</span>
                        </h1>

                        <p className="-mt-1 text-xs text-slate-500">
                            Smart EV Charging
                        </p>

                    </div>

                </NavLink>

                {/* Menu */}

                <ul className="hidden items-center gap-10 lg:flex">

                    <li>
                        <NavLink to="/" className={navStyle}>
                            Home
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/about" className={navStyle}>
                            About
                        </NavLink>
                    </li>

                    {/* EV Solutions */}

                    <li className="relative group">

                        <NavLink to="/solutions" className={navStyle}>
                            EV Solutions
                        </NavLink>

                    </li>

                    {/* SaaS */}

                    <li className="relative group">

                        <NavLink to="/services" className={navStyle}>
                            SaaS Services
                        </NavLink>

                    </li>

                    <li>
                        <NavLink to="/contact" className={navStyle}>
                            Contact
                        </NavLink>
                    </li>

                </ul>

                {/* Button */}

                <NavLink to="/contact">

                    <button className="hidden rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-3 font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-blue-300 lg:block">

                        Get In Touch

                    </button>

                </NavLink>

            </nav>
        </header>
    );
};

export default Navbar;