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
      "sameAs": contactContent.social_items.map(item => item.link)
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
    
    // Eğer contactContent null ise veya social_items yoksa fallback kullan
    if (!contactContent || !contactContent.social_items) {
      return {
        props: {
          contactContent: {
            id: '',
            title: "Contact",
            phone: "+45 123 456 789",
            email: "hello@lucastudio.com",
            social_items: [
              { name: "Instagram", link: "https://instagram.com/lucastudio" },
              { name: "LinkedIn", link: "https://linkedin.com/company/lucastudio" }
            ],
            image_path: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        },
        revalidate: 60
      };
    }
    
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
          social_items: [
            { name: "Instagram", link: "https://instagram.com/lucastudio" },
            { name: "LinkedIn", link: "https://linkedin.com/company/lucastudio" }
          ],
          image_path: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      },
      revalidate: 60
    };
  }
};
