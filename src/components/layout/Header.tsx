import { useState } from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../config/siteConfig';

export function Header() {
  const [ctaHovered, setCtaHovered] = useState(false);

  // Split brand: "NewRoof" bold + " by Revampr" regular
  const brand = siteConfig.headerBrand; // "NewRoof by Revampr"
  const byIndex = brand.indexOf(' by ');
  const primaryBrand = byIndex > -1 ? brand.slice(0, byIndex) : brand;
  const secondaryBrand = byIndex > -1 ? brand.slice(byIndex) : '';

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      width: '100%',
      height: '64px',
      background: '#FFFFFF',
      borderBottom: '1px solid #E8E5E0',
      display: 'flex',
      alignItems: 'center',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
      }}>
        {/* Wordmark */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: 0 }}>
          <span style={{ fontSize: '18px', fontWeight: 500, color: '#1A1A1A', letterSpacing: '-0.01em' }}>
            {primaryBrand}
          </span>
          <span style={{ fontSize: '18px', fontWeight: 400, color: '#666666' }}>
            {secondaryBrand}
          </span>
        </Link>

        {/* CTA pill */}
        <Link
          to="/visualize"
          style={{
            background: ctaHovered ? '#993C1D' : '#D85A30',
            color: '#FFFFFF',
            borderRadius: '20px',
            padding: '8px 20px',
            fontSize: '14px',
            fontWeight: 500,
            textDecoration: 'none',
            transition: 'background 0.15s ease',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={() => setCtaHovered(true)}
          onMouseLeave={() => setCtaHovered(false)}
        >
          Try It Free
        </Link>
      </div>
    </header>
  );
}
