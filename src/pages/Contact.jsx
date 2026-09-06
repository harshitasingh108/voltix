import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import Button from "../components/common/Button";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Full name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email address is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.subject.trim()) {
            newErrors.subject = "Subject is required";
        }

        if (!formData.message.trim()) {
            newErrors.message = "Message is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setIsSubmitting(true);

        // Simulate frontend submission processing
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
            setFormData({ name: "", email: "", subject: "", message: "" });
            setErrors({});
        }, 800);
    };

    return (
        <main className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="mx-auto max-w-7xl px-6">

                {/* HEADER */}
                <div className="mb-16 text-center">
                    <p className="uppercase tracking-[4px] text-blue-600 font-semibold text-xs">
                        Get In Touch
                    </p>
                    <h1 className="mt-4 text-5xl font-bold tracking-tight text-slate-900 md:text-6xl">
                        Contact <span className="text-blue-600">VOLTRIX</span>
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
                        Have questions about our EV charging solutions, enterprise SaaS software, or SmartCharge AI? Send us a message and our team will get back to you shortly.
                    </p>
                </div>

                <div className="grid gap-12 lg:grid-cols-3">

                    {/* CONTACT INFO SIDEBAR */}
                    <div className="space-y-6 lg:col-span-1">

                        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
                            <h2 className="text-xl font-bold text-slate-900">
                                Contact Information
                            </h2>
                            <p className="mt-2 text-sm text-slate-500">
                                Reach out directly to our support and engineering teams.
                            </p>

                            <div className="mt-8 space-y-6 text-sm">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">Headquarters</p>
                                        <p className="text-slate-600">New Delhi, India</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">Email Us</p>
                                        <p className="text-slate-600">support@voltrix.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">Phone</p>
                                        <p className="text-slate-600">+91 XXXXX XXXXX</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SMARTCHARGE AI PROMO CARD */}
                        <div className="rounded-3xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-50 to-teal-100/50 p-6 shadow-md">
                            <div className="flex items-center gap-2">
                                <Sparkles className="text-emerald-600" size={20} />
                                <h3 className="font-extrabold text-emerald-950 text-base">Looking for Charging Stations?</h3>
                            </div>
                            <p className="mt-2 text-xs leading-relaxed text-emerald-800">
                                Try SmartCharge AI to discover live charging stations along your route with demand prediction.
                            </p>
                            <Link
                                to="/smart-charge"
                                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
                            >
                                Launch SmartCharge AI →
                            </Link>
                        </div>

                    </div>

                    {/* CONTACT FORM */}
                    <div className="lg:col-span-2">
                        <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10 shadow-xl">

                            <h2 className="text-2xl font-bold text-slate-900">
                                Send Us a Message
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Fill out the form below and we will respond within 24 hours.
                            </p>

                            {submitted && (
                                <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900 animate-in fade-in">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="text-emerald-600 shrink-0" size={24} />
                                        <div>
                                            <p className="font-bold text-sm">Message Sent Successfully!</p>
                                            <p className="mt-0.5 text-xs text-emerald-700">
                                                Thank you for contacting VOLTRIX. Our team will review your inquiry and reach out shortly.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="mt-8 space-y-6">

                                <div className="grid gap-6 md:grid-cols-2">

                                    {/* NAME */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="John Doe"
                                            className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm text-slate-900 outline-none transition ${
                                                errors.name ? "border-red-400 bg-red-50/50" : "border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                            }`}
                                        />
                                        {errors.name && (
                                            <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-red-600">
                                                <AlertCircle size={13} /> {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* EMAIL */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="john@example.com"
                                            className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm text-slate-900 outline-none transition ${
                                                errors.email ? "border-red-400 bg-red-50/50" : "border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                            }`}
                                        />
                                        {errors.email && (
                                            <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-red-600">
                                                <AlertCircle size={13} /> {errors.email}
                                            </p>
                                        )}
                                    </div>

                                </div>

                                {/* SUBJECT */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        placeholder="Inquiry about EV Charging Solutions"
                                        className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm text-slate-900 outline-none transition ${
                                            errors.subject ? "border-red-400 bg-red-50/50" : "border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                        }`}
                                    />
                                    {errors.subject && (
                                        <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-red-600">
                                            <AlertCircle size={13} /> {errors.subject}
                                        </p>
                                    )}
                                </div>

                                {/* MESSAGE */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                                        Message *
                                    </label>
                                    <textarea
                                        rows={5}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="How can we help power your EV project?"
                                        className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm text-slate-900 outline-none transition ${
                                            errors.message ? "border-red-400 bg-red-50/50" : "border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                        }`}
                                    />
                                    {errors.message && (
                                        <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-red-600">
                                            <AlertCircle size={13} /> {errors.message}
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-end pt-2">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        isLoading={isSubmitting}
                                        className="w-full md:w-auto flex items-center gap-2"
                                    >
                                        <Send size={16} /> Send Message
                                    </Button>
                                </div>

                            </form>

                        </div>
                    </div>

                </div>

            </div>
        </main>
    );
};

export default Contact;