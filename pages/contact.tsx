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
    "url": "https://farukyilmaz.com/contact"
  };

  return (
    <>
      <SEO 
        title="Faruk Yılmaz | Contact"
        description="Get in touch with OFY. We're here to help bring your creative vision to life. Contact us for brand strategy, design, and development services."
        image="https://farukyilmaz.com/images/contact-og.jpg"
        schema={schema}
      />
      <ContactPage content={contactContent} />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const contactContent = await fetchContact();
    
    // Eğer contactContent null ise fallback kullan
    if (!contactContent) {
      return {
        props: {
          contactContent: {
            id: '',
            title: "Contact",
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
          image_path: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      },
      revalidate: 60
    };
  }
};
