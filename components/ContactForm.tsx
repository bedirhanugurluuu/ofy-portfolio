"use client";
import React, { useState, useImperativeHandle, forwardRef, useEffect } from "react";

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface ContactFormRef {
  submit: () => Promise<void>;
}

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

const ContactForm = forwardRef<ContactFormRef>((props, ref) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY || document.getElementById("recaptcha-script")) {
      return;
    }

    const script = document.createElement("script");
    script.id = "recaptcha-script";
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    document.head.appendChild(script);
  }, []);

  const getRecaptchaToken = async (): Promise<string | undefined> => {
    if (!RECAPTCHA_SITE_KEY || !window.grecaptcha) {
      return undefined;
    }

    await new Promise<void>((resolve) => {
      window.grecaptcha!.ready(resolve);
    });

    return window.grecaptcha.execute(RECAPTCHA_SITE_KEY, {
      action: "contact_form",
    });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const recaptchaToken = await getRecaptchaToken();

      const response = await fetch("/api/contact-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          recaptchaToken,
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      if (error instanceof Error && !error.message.includes("400")) {
        console.error("Error submitting form:", error);
      }
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
  }));

  useEffect(() => {
    const styleId = "contact-form-autofill-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-text-fill-color: white !important;
          -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
          box-shadow: 0 0 0px 1000px transparent inset !important;
          background-color: transparent !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      const style = document.getElementById(styleId);
      if (style) {
        style.remove();
      }
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-xl">
      <div>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
          className="w-full bg-transparent border-b border-white/30 text-white placeholder-white/40 focus:outline-none focus:border-white/60 transition-colors pb-2 text-sm"
        />
      </div>
      <div>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full bg-transparent border-b border-white/30 text-white placeholder-white/40 focus:outline-none focus:border-white/60 transition-colors pb-2 text-sm"
        />
      </div>
      <div>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone (optional)"
          className="w-full bg-transparent border-b border-white/30 text-white placeholder-white/40 focus:outline-none focus:border-white/60 transition-colors pb-2 text-sm"
        />
      </div>
      <div>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Message"
          required
          rows={4}
          className="w-full bg-transparent border-b border-white/30 text-white placeholder-white/40 focus:outline-none focus:border-white/60 transition-colors pb-2 text-sm resize-none"
        />
      </div>
      {submitStatus === "success" && (
        <p className="text-green-400 text-sm">Message sent successfully!</p>
      )}
      {submitStatus === "error" && (
        <p className="text-red-400 text-sm">Error sending message. Please try again.</p>
      )}
    </form>
  );
});

ContactForm.displayName = "ContactForm";

export default ContactForm;
