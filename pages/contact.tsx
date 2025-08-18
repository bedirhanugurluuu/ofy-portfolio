import React from "react";
import { GetStaticProps } from 'next';
import { fetchContact, ContactContent } from '@/lib/api';
import ContactPage from '../components/ContactPage';

interface ContactPageProps {
  contactContent: ContactContent;
}

export default function Contact({ contactContent }: ContactPageProps) {
  return <ContactPage content={contactContent} />;
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
