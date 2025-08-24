"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email) {
            setMessage("Please enter your email address");
            return;
        }

        if (!email.includes("@")) {
            setMessage("Please enter a valid email address");
            return;
        }

        setIsSubmitting(true);
        setMessage("");

        try {
            // Newsletter subscription API call
            const response = await fetch("/api/newsletter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setMessage("Thank you for subscribing!");
                setEmail("");
            } else {
                setMessage("Something went wrong. Please try again.");
            }
        } catch (error) {
            setMessage("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <footer className="bg-black text-white relative lg:sticky bottom-0 px-4 pt-25 pb-8" style={{ zIndex: '1' }}>
            <div className="mx-auto">
                {/* CTA */}
                <div className="mb-11">
                    <p className="text-white opacity-50 text-3xl max-w-[260px] lg:max-w-none lg:text-4xl font-medium mb-2">
                        Interested in working with us?
                    </p>
                    <a
                        href="#"
                        className="text-white text-3xl lg:text-4xl transition font-medium relative inline-block group hover:opacity-50"
                    >
                        <span className="block text-white group">
                            Get in touch
                        </span>
                    </a>
                </div>

                {/* Line */}
                <div className="border-t border-gray-white opacity-20 mb-5" />

                {/* Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 lg:gap-10 text-sm mb-20 lg:mb-55">
                    {/* Sitemap */}
                    <div>
                        <h4 className="text-white opacity-40 font-medium mb-2">SITEMAP</h4>
                        <ul className="space-y-2">
                            {["Home", "About", "Projects", "Contact"].map((item, i) => (
                                <li key={i} className="mb-0">
                                    <a
                                        href="#"
                                        className="text-white text-md font-medium hover:opacity-40 transition"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Location */}
                    <div>
                        <h4 className="text-white opacity-40 font-medium mb-2">LOCATION</h4>
                        <p className="text-white font-medium">
                            İstanbul Bahçelievler<br />
                            Test Sokak, 10001<br />
                            Türkiye
                        </p>
                    </div>

                    {/* Socials */}
                    <div>
                        <h4 className="text-white opacity-40 font-medium mb-2">SOCIALS</h4>
                        <ul className="space-y-2">
                            {["Instagram", "LinkedIn", "Dribbble", "X"].map((item, i) => (
                                <li key={i} className="mb-0">
                                    <a
                                        href="#"
                                        className="text-white text-md font-medium hover:opacity-40 transition"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-white opacity-40 font-medium mb-2">NEWSLETTER</h4>
                        <form onSubmit={handleNewsletterSubmit} className="flex items-center px-3 py-1 rounded" style={{ background: 'rgb(46, 46, 46)' }}>
                            <input
                                type="email"
                                placeholder="Your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-transparent text-white placeholder:text-[#666666] placeholder:font-medium font-medium flex-1 outline-none py-2"
                                aria-label="Email address for newsletter subscription"
                                disabled={isSubmitting}
                            />
                            <button 
                                type="submit" 
                                className="text-white hover:text-gray-300 p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Subscribe to newsletter"
                                disabled={isSubmitting}
                            >
                                <ArrowRight className="w-3 h-3" />
                            </button>
                        </form>
                        {message && (
                            <p className={`text-xs mt-2 ${message.includes("Thank you") ? "text-green-400" : "text-red-400"}`}>
                                {message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Bottom Text */}
                <div className="text-white font-medium opacity-40 text-xs text-center" style={{ letterSpacing: 0 }}>
                    © 2025 Ömer Faruk Yılmaz. Tüm hakları saklıdır.
                </div>
            </div>
        </footer>
    );
}
