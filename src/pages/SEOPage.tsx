import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import type { SEOPageConfig } from '../types/site';

interface SEOPageProps {
  config: SEOPageConfig;
}

export function SEOPage({ config }: SEOPageProps) {
  const [btnHovered, setBtnHovered] = useState(false);

  return (
    <>
      <Helmet>
        <title>{config.title}</title>
        <meta name="description" content={config.metaDescription} />
        <link rel="canonical" href={`https://newroof.io/${config.slug}`} />
        <meta property="og:url" content={`https://newroof.io/${config.slug}`} />
        <meta property="og:title" content={config.title} />
        <meta property="og:description" content={config.metaDescription} />
        <meta property="og:image" content="https://newroof.io/og-image.jpg" />
      </Helmet>

      <div style={{
        background: '#FAF9F7',
        minHeight: 'calc(100vh - 128px)',
        padding: '80px 0',
      }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 500,
            color: '#1A1A1A',
            marginBottom: '20px',
          }}>
            {config.h1}
          </h1>

          <p style={{
            fontSize: '16px',
            color: '#666666',
            lineHeight: 1.6,
            marginBottom: '32px',
          }}>
            {config.metaDescription}
          </p>

          <p style={{
            fontSize: '15px',
            color: '#666666',
            lineHeight: 1.6,
            marginBottom: '40px',
          }}>
            Use NewRoof's free AI roof visualizer to see exactly what your home would look like with a new{' '}
            {config.h1.toLowerCase()}. Upload a photo, pick your preferred style, and get a photorealistic render in 30 seconds — no account required.
          </p>

          <Link
            to="/visualize"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: btnHovered ? '#993C1D' : '#D85A30',
              color: '#FFFFFF',
              borderRadius: '8px',
              padding: '14px 28px',
              fontSize: '15px',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={() => setBtnHovered(true)}
            onMouseLeave={() => setBtnHovered(false)}
          >
            Try It Free — No Account Needed
          </Link>
        </div>
      </div>
    </>
  );
}
