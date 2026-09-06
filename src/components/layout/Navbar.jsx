import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, Link } from "react-router-dom";
import {
    ChevronDown,
    Zap,
    BatteryCharging,
    Network,
    BarChart3,
    Smartphone,
    Cog,
    Cloud,
    Menu,
    X,
    Sparkles
} from "lucide-react";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [solutionsOpen, setSolutionsOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
    const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

    const location = useLocation();

    const solutionsRef = useRef(null);
    const servicesRef = useRef(null);
    const navHeaderRef = useRef(null);

    // Scroll listener for sticky navbar background transition
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 30);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close all menus on route change
    useEffect(() => {
        setSolutionsOpen(false);
        setServicesOpen(false);
        setMobileOpen(false);
        setMobileSolutionsOpen(false);
        setMobileServicesOpen(false);
    }, [location.pathname]);

    // Close dropdowns on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (solutionsRef.current && !solutionsRef.current.contains(event.target)) {
                setSolutionsOpen(false);
            }
            if (servicesRef.current && !servicesRef.current.contains(event.target)) {
                setServicesOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close dropdowns on Escape key press
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setSolutionsOpen(false);
                setServicesOpen(false);
                setMobileOpen(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const navStyle = ({ isActive }) =>
        `relative py-2 text-sm font-semibold transition duration-300 flex items-center gap-1 ${
            isActive
                ? "text-blue-600 font-bold border-b-2 border-blue-600"
                : "text-slate-700 hover:text-blue-600"
        }`;

    return (
        <header
            ref={navHeaderRef}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-7xl rounded-full transition-all duration-500 ${
                scrolled
                    ? "bg-white/95 backdrop-blur-xl shadow-2xl border border-slate-200/80 py-1"
                    : "bg-white/80 backdrop-blur-xl border border-white/70 shadow-lg py-1.5"
            }`}
        >
            <nav className="flex h-16 items-center justify-between px-6 lg:px-8" aria-label="Main Navigation">

                {/* BRAND LOGO */}
                <NavLink to="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-blue-500/30 rounded-full p-1">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 shadow-md transition group-hover:scale-105">
                        <span className="text-xl text-white">⚡</span>
                    </div>

                    <div>
                        <h1 className="text-xl font-extrabold tracking-wide text-slate-900 leading-tight">
                            VOLT<span className="text-blue-600">RIX</span>
                        </h1>
                        <p className="-mt-1 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                            Smart EV Platform
                        </p>
                    </div>
                </NavLink>

                {/* DESKTOP MENU */}
                <ul className="hidden items-center gap-8 lg:flex">

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

                    {/* EV SOLUTIONS DROPDOWN */}
                    <li className="relative" ref={solutionsRef}>
                        <button
                            type="button"
                            onClick={() => {
                                setSolutionsOpen((prev) => !prev);
                                setServicesOpen(false);
                            }}
                            aria-expanded={solutionsOpen}
                            aria-haspopup="true"
                            aria-controls="solutions-dropdown-menu"
                            className={`flex items-center gap-1.5 py-2 text-sm font-semibold transition duration-300 outline-none ${
                                solutionsOpen || location.pathname === "/solutions"
                                    ? "text-blue-600 font-bold"
                                    : "text-slate-700 hover:text-blue-600"
                            }`}
                        >
                            <span>EV Solutions</span>
                            <ChevronDown
                                size={15}
                                className={`transition-transform duration-300 ${solutionsOpen ? "rotate-180 text-blue-600" : "text-slate-400"}`}
                            />
                        </button>

                        {/* DROPDOWN MENU */}
                        {solutionsOpen && (
                            <div
                                id="solutions-dropdown-menu"
                                role="menu"
                                className="absolute left-0 top-full mt-3 w-72 rounded-2xl border border-slate-100 bg-white p-3 shadow-2xl shadow-slate-900/10 transition-all duration-300 animate-in fade-in slide-in-from-top-2 z-50"
                            >
                                <Link
                                    to="/solutions"
                                    onClick={() => setSolutionsOpen(false)}
                                    className="flex items-start gap-3 rounded-xl p-2.5 transition hover:bg-blue-50/70 group"
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                                        <Zap size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600">All EV Solutions</p>
                                        <p className="text-[11px] text-slate-500 leading-tight">Explore full range of hardware & network tools.</p>
                                    </div>
                                </Link>

                                <div className="my-1 border-t border-slate-100" />

                                <Link
                                    to="/smart-charge"
                                    onClick={() => setSolutionsOpen(false)}
                                    className="flex items-start gap-3 rounded-xl p-2.5 transition hover:bg-emerald-50/80 group border border-emerald-200/50 bg-emerald-50/30"
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
                                        <Sparkles size={18} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1.5">
                                            <p className="text-xs font-bold text-emerald-950">SmartCharge AI</p>
                                            <span className="rounded bg-emerald-600 px-1.5 py-0.2 text-[9px] font-extrabold text-white">AI</span>
                                        </div>
                                        <p className="text-[11px] text-emerald-700 leading-tight">AI demand predictions & station recommendations.</p>
                                    </div>
                                </Link>

                                <Link
                                    to="/solutions"
                                    onClick={() => setSolutionsOpen(false)}
                                    className="flex items-start gap-3 rounded-xl p-2.5 transition hover:bg-slate-50 group"
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-cyan-100 group-hover:text-cyan-700 transition">
                                        <BatteryCharging size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">DC Fast Charging</p>
                                        <p className="text-[11px] text-slate-500 leading-tight">High-speed chargers for commercial highways.</p>
                                    </div>
                                </Link>

                                <Link
                                    to="/solutions"
                                    onClick={() => setSolutionsOpen(false)}
                                    className="flex items-start gap-3 rounded-xl p-2.5 transition hover:bg-slate-50 group"
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700 transition">
                                        <Network size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">Charging Network</p>
                                        <p className="text-[11px] text-slate-500 leading-tight">Connected infrastructure & management.</p>
                                    </div>
                                </Link>
                            </div>
                        )}
                    </li>

                    {/* SAAS SERVICES DROPDOWN */}
                    <li className="relative" ref={servicesRef}>
                        <button
                            type="button"
                            onClick={() => {
                                setServicesOpen((prev) => !prev);
                                setSolutionsOpen(false);
                            }}
                            aria-expanded={servicesOpen}
                            aria-haspopup="true"
                            aria-controls="services-dropdown-menu"
                            className={`flex items-center gap-1.5 py-2 text-sm font-semibold transition duration-300 outline-none ${
                                servicesOpen || location.pathname === "/services"
                                    ? "text-blue-600 font-bold"
                                    : "text-slate-700 hover:text-blue-600"
                            }`}
                        >
                            <span>SaaS Services</span>
                            <ChevronDown
                                size={15}
                                className={`transition-transform duration-300 ${servicesOpen ? "rotate-180 text-blue-600" : "text-slate-400"}`}
                            />
                        </button>

                        {/* DROPDOWN MENU */}
                        {servicesOpen && (
                            <div
                                id="services-dropdown-menu"
                                role="menu"
                                className="absolute left-0 top-full mt-3 w-72 rounded-2xl border border-slate-100 bg-white p-3 shadow-2xl shadow-slate-900/10 transition-all duration-300 animate-in fade-in slide-in-from-top-2 z-50"
                            >
                                <Link
                                    to="/services"
                                    onClick={() => setServicesOpen(false)}
                                    className="flex items-start gap-3 rounded-xl p-2.5 transition hover:bg-blue-50/70 group"
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                                        <BarChart3 size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600">All SaaS Services</p>
                                        <p className="text-[11px] text-slate-500 leading-tight">Software suite for EV infrastructure operations.</p>
                                    </div>
                                </Link>

                                <div className="my-1 border-t border-slate-100" />

                                <Link
                                    to="/services"
                                    onClick={() => setServicesOpen(false)}
                                    className="flex items-start gap-3 rounded-xl p-2.5 transition hover:bg-slate-50 group"
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-cyan-100 group-hover:text-cyan-700 transition">
                                        <Smartphone size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">Mobile Application</p>
                                        <p className="text-[11px] text-slate-500 leading-tight">On-the-go monitoring & remote session control.</p>
                                    </div>
                                </Link>

                                <Link
                                    to="/services"
                                    onClick={() => setServicesOpen(false)}
                                    className="flex items-start gap-3 rounded-xl p-2.5 transition hover:bg-slate-50 group"
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-700 transition">
                                        <Cog size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">Smart Telemetry</p>
                                        <p className="text-[11px] text-slate-500 leading-tight">Automated diagnostics & AI health alerts.</p>
                                    </div>
                                </Link>

                                <Link
                                    to="/services"
                                    onClick={() => setServicesOpen(false)}
                                    className="flex items-start gap-3 rounded-xl p-2.5 transition hover:bg-slate-50 group"
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700 transition">
                                        <Cloud size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">Cloud Infrastructure</p>
                                        <p className="text-[11px] text-slate-500 leading-tight">Secure cloud platform with 99.9% uptime.</p>
                                    </div>
                                </Link>
                            </div>
                        )}
                    </li>

                    {/* SMARTCHARGE DIRECT ROUTE LINK */}
                    <li>
                        <NavLink to="/smart-charge" className={navStyle}>
                            <span className="flex items-center gap-1">
                                <Sparkles size={14} className="text-cyan-500" />
                                SmartCharge
                                <span className="rounded bg-gradient-to-r from-blue-600 to-cyan-500 px-1.5 py-0.2 text-[9px] font-extrabold text-white">AI</span>
                            </span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/contact" className={navStyle}>
                            Contact
                        </NavLink>
                    </li>

                </ul>

                {/* RIGHT ACTION BUTTON (DESKTOP) */}
                <div className="hidden items-center gap-3 lg:flex">
                    <Link
                        to="/smart-charge"
                        className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30"
                    >
                        Try SmartCharge →
                    </Link>
                </div>

                {/* MOBILE HAMBURGER BUTTON */}
                <button
                    type="button"
                    onClick={() => setMobileOpen((prev) => !prev)}
                    aria-label="Toggle Navigation Menu"
                    aria-expanded={mobileOpen}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-blue-50 hover:text-blue-600 lg:hidden"
                >
                    {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

            </nav>

            {/* RESPONSIVE MOBILE MENU DRAWER */}
            {mobileOpen && (
                <div className="border-t border-slate-100 bg-white/95 backdrop-blur-2xl px-6 py-5 rounded-b-[28px] shadow-2xl lg:hidden animate-in fade-in slide-in-from-top-3">
                    <ul className="space-y-3 text-sm font-semibold text-slate-800">
                        <li>
                            <NavLink
                                to="/"
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) =>
                                    `block py-2 ${isActive ? "text-blue-600 font-bold" : "hover:text-blue-600"}`
                                }
                            >
                                Home
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                to="/about"
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) =>
                                    `block py-2 ${isActive ? "text-blue-600 font-bold" : "hover:text-blue-600"}`
                                }
                            >
                                About Us
                            </NavLink>
                        </li>

                        {/* MOBILE SOLUTIONS ACCORDION */}
                        <li>
                            <div className="flex items-center justify-between py-2">
                                <NavLink
                                    to="/solutions"
                                    onClick={() => setMobileOpen(false)}
                                    className="hover:text-blue-600"
                                >
                                    EV Solutions
                                </NavLink>
                                <button
                                    type="button"
                                    onClick={() => setMobileSolutionsOpen((prev) => !prev)}
                                    className="p-1 text-slate-500 hover:text-blue-600"
                                    aria-label="Toggle EV Solutions Menu"
                                >
                                    <ChevronDown
                                        size={18}
                                        className={`transition-transform ${mobileSolutionsOpen ? "rotate-180 text-blue-600" : ""}`}
                                    />
                                </button>
                            </div>

                            {mobileSolutionsOpen && (
                                <ul className="ml-4 mt-1 space-y-2 border-l-2 border-blue-100 pl-3 text-xs text-slate-600">
                                    <li>
                                        <NavLink
                                            to="/solutions"
                                            onClick={() => setMobileOpen(false)}
                                            className="block py-1 hover:text-blue-600"
                                        >
                                            All EV Solutions
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/smart-charge"
                                            onClick={() => setMobileOpen(false)}
                                            className="block py-1 font-bold text-emerald-700 hover:text-emerald-900"
                                        >
                                            ⚡ SmartCharge AI Recommendation
                                        </NavLink>
                                    </li>
                                </ul>
                            )}
                        </li>

                        {/* MOBILE SERVICES ACCORDION */}
                        <li>
                            <div className="flex items-center justify-between py-2">
                                <NavLink
                                    to="/services"
                                    onClick={() => setMobileOpen(false)}
                                    className="hover:text-blue-600"
                                >
                                    SaaS Services
                                </NavLink>
                                <button
                                    type="button"
                                    onClick={() => setMobileServicesOpen((prev) => !prev)}
                                    className="p-1 text-slate-500 hover:text-blue-600"
                                    aria-label="Toggle SaaS Services Menu"
                                >
                                    <ChevronDown
                                        size={18}
                                        className={`transition-transform ${mobileServicesOpen ? "rotate-180 text-blue-600" : ""}`}
                                    />
                                </button>
                            </div>

                            {mobileServicesOpen && (
                                <ul className="ml-4 mt-1 space-y-2 border-l-2 border-blue-100 pl-3 text-xs text-slate-600">
                                    <li>
                                        <NavLink
                                            to="/services"
                                            onClick={() => setMobileOpen(false)}
                                            className="block py-1 hover:text-blue-600"
                                        >
                                            All SaaS Services
                                        </NavLink>
                                    </li>
                                </ul>
                            )}
                        </li>

                        {/* MOBILE SMARTCHARGE LINK */}
                        <li>
                            <NavLink
                                to="/smart-charge"
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-2 py-2 font-bold text-blue-600"
                            >
                                <Sparkles size={16} className="text-cyan-500" />
                                SmartCharge AI Station Finder
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                to="/contact"
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) =>
                                    `block py-2 ${isActive ? "text-blue-600 font-bold" : "hover:text-blue-600"}`
                                }
                            >
                                Contact
                            </NavLink>
                        </li>
                    </ul>

                    <div className="mt-4 pt-3 border-t border-slate-100">
                        <Link
                            to="/smart-charge"
                            onClick={() => setMobileOpen(false)}
                            className="block w-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 py-3 text-center text-xs font-bold text-white shadow-md"
                        >
                            Try SmartCharge AI →
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;