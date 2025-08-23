import React from "react";
import { GetStaticProps } from 'next';
import { fetchContact, ContactContent } from '@/lib/api';
import ContactPage from '../components/ContactPage';
import SEO from '@/components/SEO';

interface ContactPageProps {
  contactContent: ContactContent;
}

export default function Contact({ contactContent }: ContactPageProps) {
  // Schema for contact page
  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact - OFY Portfolio",
    "description": "Get in touch with OFY. We're here to help bring your creative vision to life.",
    "url": "https://ofy-portfolio.vercel.app/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "OFY",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": contactContent.phone,
        "email": contactContent.email,
        "contactType": "customer service",
        "availableLanguage": "English"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": contactContent.address_line1,
        "addressLocality": "Copenhagen",
        "addressCountry": "Denmark",
        "postalCode": "1051"
      },
      "sameAs": [
        contactContent.instagram,
        contactContent.linkedin
      ]
    }
  };

  return (
    <>
      <SEO 
        title={`${contactContent.title} - OFY Portfolio`}
        description="Get in touch with OFY. We're here to help bring your creative vision to life. Contact us for brand strategy, design, and development services."
        image={contactContent.image_path ? `https://lsxafginsylkeuyzuiau.supabase.co/storage/v1/object/public/uploads/${contactContent.image_path}` : "https://ofy-portfolio.vercel.app/images/contact-og.jpg"}
        schema={schema}
      />
      <ContactPage content={contactContent} />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const contactContent = await fetchContact();
    
    return {
      props: {
        contactContent
      },
      revalidate: 60 // 1 dakikada bir yenile
    };
  } catch (error) {
    console.error('Contact static props error:', error);
    return {
      props: {
        contactContent: {
          id: '',
          title: "Contact",
          phone: "+45 123 456 789",
          email: "hello@lucastudio.com",
          instagram: "https://instagram.com/lucastudio",
          linkedin: "https://linkedin.com/company/lucastudio",
          address_line1: "12 Nyhavn Street",
          address_line2: "Copenhagen, Denmark, 1051",
          studio_hours_weekdays: "Monday to Friday: 9:00 AM – 6:00 PM",
          studio_hours_weekend: "Saturday & Sunday: Closed",
          image_path: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      },
      revalidate: 60
    };
  }
};
