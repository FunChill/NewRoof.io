import { Helmet } from 'react-helmet-async';
import { HeroSection } from '../components/home/HeroSection';
import { ColorSwatchGrid } from '../components/home/ColorSwatchGrid';
import { HowItWorks } from '../components/home/HowItWorks';
import { GallerySection } from '../components/home/GallerySection';
import { WhyVisualize } from '../components/home/WhyVisualize';
import { FAQSection } from '../components/home/FAQSection';
import { FAQSchema } from '../components/home/FAQSchema';
import { FooterCTA } from '../components/home/FooterCTA';

export function HomePage() {
  return (
    <>
      <Helmet>
        <title>NewRoof — See Your New Roof Before It's Installed</title>
        <meta name="description" content="Upload a photo of your house and see what a new roof looks like. 9 colors, 12 materials. Free AI renders in 30 seconds." />
        <link rel="canonical" href="https://newroof.io/" />
        <meta property="og:url" content="https://newroof.io/" />
        <meta property="og:title" content="See Your New Roof Before It's Installed" />
        <meta property="og:description" content="Upload a photo. Pick a color. See your new roof in 30 seconds. Free AI roof visualizer." />
        <meta property="og:image" content="https://newroof.io/og-image.jpg" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'NewRoof by Revampr',
            url: 'https://newroof.io',
            description: 'AI-powered roof visualizer. Upload a house photo and see what a new roof looks like in 30 seconds.',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://newroof.io/visualize',
              'query-input': 'required name=search_term_string',
            },
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'NewRoof by Revampr',
            url: 'https://newroof.io',
            logo: 'https://newroof.io/og-image.jpg',
            sameAs: ['https://www.revampr.io'],
          })}
        </script>
      </Helmet>
      <FAQSchema />
      <HeroSection />
      <ColorSwatchGrid />
      <HowItWorks />
      <GallerySection />
      <WhyVisualize />
      <FAQSection />
      <FooterCTA />
    </>
  );
}
