import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../config/siteConfig';
import { BeforeAfterSlider } from '../shared/BeforeAfterSlider';

export function HeroSection() {
  const [visible, setVisible] = useState(false);
  const [sliderVisible, setSliderVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 50);
    const t2 = setTimeout(() => setSliderVisible(true), 250);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const { theme } = siteConfig;

  return (
    <section style={{
      backgroundImage: `url('/hero/bg.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: theme.heroBackground, // fallback when image missing
      minHeight: 'calc(100vh - 64px)',
      maxHeight: '800px',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      width: '100%',
      position: 'relative',
    }}>
      {/* Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(26, 58, 74, 0.82)',
        zIndex: 0,
      }} />

      {/* Content above overlay */}
      <div className="container" style={{ paddingTop: '48px', paddingBottom: '48px', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 55fr) minmax(0, 45fr)',
          gap: '40px',
          alignItems: 'center',
          width: '100%',
        }}
          className="hero-grid"
        >
          {/* LEFT: Text */}
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}>
            <h1 style={{
              fontSize: '48px',
              fontWeight: 500,
              color: theme.heroTextColor,
              lineHeight: 1.15,
              marginBottom: '20px',
            }} className="hero-headline">
              {siteConfig.tagline}
            </h1>
            <p style={{
              fontSize: '18px',
              fontWeight: 400,
              color: theme.heroSubTextColor,
              lineHeight: 1.5,
              marginBottom: '32px',
            }} className="hero-subhead">
              {siteConfig.subTagline}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}
              className="hero-cta-wrap">
              <HeroCTAButton />
              <p style={{ fontSize: '13px', color: theme.heroSubTextColor, margin: 0 }}>
                Free — no account needed
              </p>
            </div>
          </div>

          {/* RIGHT: Slider — clean card, no overlay */}
          <div style={{
            opacity: sliderVisible ? 1 : 0,
            transform: sliderVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}>
            <BeforeAfterSlider
              beforeSrc={siteConfig.heroBeforeImage}
              afterSrc={siteConfig.heroAfterImage}
              defaultPosition={75}
              autoAnimate={true}
              caption="Drag to reveal"
              aspectRatio="16/10"
              borderRadius={12}
            />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .hero-grid > div:first-child { order: 2; }
          .hero-grid > div:last-child { order: 1; }
          .hero-headline { font-size: 32px !important; text-align: center; }
          .hero-subhead { font-size: 16px !important; text-align: center; }
          .hero-cta-wrap { align-items: center !important; }
        }
      `}</style>
    </section>
  );
}

function HeroCTAButton() {
  const [hovered, setHovered] = useState(false);
  return (
    <Link to="/visualize" style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: hovered ? '#993C1D' : '#D85A30',
      color: '#FFFFFF',
      borderRadius: '8px',
      padding: '16px 32px',
      fontSize: '16px',
      fontWeight: 500,
      textDecoration: 'none',
      transition: 'background 0.15s ease',
    }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      Upload Your House Photo
    </Link>
  );
}
