import React from "react";
import Link from "next/link";
import Image from "next/image";
import SEO from "@/components/SEO";

export default function Custom404() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "404 - Page Not Found",
    "description": "The page you're looking for doesn't exist.",
    "url": "https://farukyilmaz.com/404"
  };

  return (
    <>
      <SEO 
        title="404 - Page Not Found | OFY Portfolio"
        description="The page you're looking for doesn't exist. Return to our portfolio."
        image="https://farukyilmaz.com/images/og-image.jpg"
        schema={schema}
      />
      
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5">
        {/* Main Content */}
        <div className="text-center max-w-2xl mx-auto">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-8xl md:text-9xl font-bold text-gray-200 mb-4">
              404
            </h1>
          </div>

          {/* Error Message */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-medium text-gray-800 mb-4">
              Page Not Found
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              The page you're looking for doesn't exist or has been moved. 
              Let's get you back to exploring our work.
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="group relative inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-medium transition-all duration-300 hover:bg-gray-800"
            >
              Back to Home
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path 
                  d="M9 18L15 12L9 6" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            <Link
              href="/projects"
              className="group relative inline-flex items-center gap-2 px-8 py-4 border-2 border-black text-black font-medium transition-all duration-300 hover:bg-black hover:text-white"
            >
              View Projects
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path 
                  d="M9 18L15 12L9 6" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>

          {/* Additional Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-500 mb-4">Or explore our other pages:</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/about" className="text-gray-600 hover:text-black transition-colors">
                About
              </Link>
              <Link href="/blog" className="text-gray-600 hover:text-black transition-colors">
                Blog
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-black transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
      </div>
    </>
  );
}
