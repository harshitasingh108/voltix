import { Link } from "react-router-dom";
import { Zap, Mail, Phone, MapPin, Globe, Share2, MessageSquare } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-[#08111F] text-white">

            <div className="mx-auto max-w-7xl px-6 py-20">

                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

                    {/* BRAND COL */}
                    <div>
                        <Link to="/" className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 shadow-md">
                                <span className="text-lg text-white">⚡</span>
                            </div>
                            <h2 className="text-3xl font-extrabold tracking-wide text-white">
                                VOLT<span className="text-blue-500">RIX</span>
                            </h2>
                        </Link>

                        <p className="mt-5 text-sm leading-6 text-slate-400">
                            Intelligent EV charging solutions built for homes,
                            businesses and public infrastructure powered by AI.
                        </p>

                        {/* SOCIAL / PLATFORM ICONS */}
                        <div className="mt-6 flex items-center gap-3">
                            <a
                                href="https://voltrix.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Global Web Portal"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800/80 text-slate-300 transition hover:bg-blue-600 hover:text-white"
                            >
                                <Globe size={16} />
                            </a>
                            <a
                                href="mailto:support@voltrix.com"
                                aria-label="Support Mail"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800/80 text-slate-300 transition hover:bg-blue-600 hover:text-white"
                            >
                                <Mail size={16} />
                            </a>
                            <a
                                href="tel:+910000000000"
                                aria-label="Phone Support"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800/80 text-slate-300 transition hover:bg-blue-600 hover:text-white"
                            >
                                <Phone size={16} />
                            </a>
                        </div>
                    </div>

                    {/* QUICK LINKS */}
                    <div>
                        <h3 className="mb-6 text-lg font-semibold text-white">
                            Quick Links
                        </h3>

                        <ul className="space-y-3 text-sm text-slate-400">
                            <li>
                                <Link to="/" className="transition hover:text-blue-400">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="transition hover:text-blue-400">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/solutions" className="transition hover:text-blue-400">
                                    EV Solutions
                                </Link>
                            </li>
                            <li>
                                <Link to="/services" className="transition hover:text-blue-400">
                                    SaaS Services
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="transition hover:text-blue-400">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* SOLUTIONS & AI */}
                    <div>
                        <h3 className="mb-6 text-lg font-semibold text-white">
                            EV Platform
                        </h3>

                        <ul className="space-y-3 text-sm text-slate-400">
                            <li>
                                <Link to="/smart-charge" className="flex items-center gap-1.5 font-bold text-emerald-400 transition hover:text-emerald-300">
                                    <Zap size={14} /> SmartCharge AI Finder
                                </Link>
                            </li>
                            <li>
                                <Link to="/solutions" className="transition hover:text-blue-400">
                                    Fast DC Chargers
                                </Link>
                            </li>
                            <li>
                                <Link to="/solutions" className="transition hover:text-blue-400">
                                    Smart AC Chargers
                                </Link>
                            </li>
                            <li>
                                <Link to="/services" className="transition hover:text-blue-400">
                                    Fleet Management
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* CONTACT */}
                    <div>
                        <h3 className="mb-6 text-lg font-semibold text-white">
                            Contact
                        </h3>

                        <div className="space-y-4 text-sm text-slate-400">
                            <p className="flex items-center gap-3">
                                <MapPin size={16} className="text-blue-400 shrink-0" />
                                <span>New Delhi, India</span>
                            </p>
                            <p className="flex items-center gap-3">
                                <Phone size={16} className="text-blue-400 shrink-0" />
                                <span>+91 XXXXX XXXXX</span>
                            </p>
                            <p className="flex items-center gap-3">
                                <Mail size={16} className="text-blue-400 shrink-0" />
                                <span>support@voltrix.com</span>
                            </p>
                        </div>
                    </div>

                </div>

                <div className="mt-16 border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
                    <p>© 2026 VOLTRIX. All Rights Reserved.</p>
                    <p className="mt-3 md:mt-0">
                        Designed & Developed by <span className="text-blue-400 font-semibold">Harshita</span>
                    </p>
                </div>

            </div>

        </footer>
    );
};

export default Footer;