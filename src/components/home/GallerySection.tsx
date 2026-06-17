import { useState } from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../config/siteConfig';
import { BeforeAfterSlider } from '../shared/BeforeAfterSlider';

export function GallerySection() {
  const [ctaHovered, setCtaHovered] = useState(false);

  return (
    <section style={{
      background: '#FFFFFF',
      padding: '80px 0',
    }}>
      <div className="container">
        {/* Section label */}
        <p style={{
          fontSize: '12px',
          color: '#666666',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          textAlign: 'center',
          marginBottom: '8px',
        }}>
          Real Transformations
        </p>

        {/* Heading */}
        <h2 style={{
          fontSize: '28px',
          fontWeight: 500,
          color: '#1A1A1A',
          textAlign: 'center',
          marginBottom: '48px',
        }}>
          Before &amp; After
        </h2>

        {/* Gallery grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px',
          marginBottom: '40px',
        }}
          className="gallery-grid"
        >
          {siteConfig.galleryItems.map((item) => (
            <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <BeforeAfterSlider
                beforeSrc={item.beforeUrl}
                afterSrc={item.afterUrl}
                defaultPosition={50}
                aspectRatio="16/10"
                borderRadius={10}
              />
              <p style={{
                fontSize: '12px',
                color: '#AAAAAA',
                fontWeight: 400,
                textAlign: 'center',
                margin: 0,
              }}>
                {item.colorName}
              </p>
            </div>
          ))}
        </div>

        {/* CTA link */}
        <div style={{ textAlign: 'center' }}>
          <Link
            to="/visualize"
            style={{
              fontSize: '16px',
              fontWeight: 500,
              color: ctaHovered ? '#993C1D' : '#D85A30',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={() => setCtaHovered(true)}
            onMouseLeave={() => setCtaHovered(false)}
          >
            See Yours Now →
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .gallery-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
