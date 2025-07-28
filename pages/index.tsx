import Link from 'next/link'
import IntroBanner from '@/components/IntroBanner'
import Layout from "@/components/Layout";
import FeaturedProjects from '@/components/FeaturedProjects';
import ServicesSlider from '@/components/ServicesSlider';
import AboutBanner from '@/components/AboutBanner';
import FromTheJournal from '@/components/FromTheJournal';

export default function Home() {
  return (
    <div>
      <IntroBanner />
      <FeaturedProjects />
      <ServicesSlider />
      <AboutBanner />
      <FromTheJournal />
    </div>
  )
}