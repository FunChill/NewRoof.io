import { useState } from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../config/siteConfig';

export function Footer() {
  const [revamprHovered, setRevamprHovered] = useState(false);

  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      background: '#FAF9F7',
      borderTop: '1px solid #E8E5E0',
      padding: '40px 0 32px',
    }}>
      <div className="container">
        {/* Top row: Powered by */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '14px', color: '#666666' }}>
            {siteConfig.footerPoweredBy.split('Revampr.io')[0]}
          </span>
          <a
            href={`https://www.revampr.io?source=${siteConfig.sourceParam}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: revamprHovered ? '#993C1D' : '#D85A30',
              textDecoration: revamprHovered ? 'underline' : 'none',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={() => setRevamprHovered(true)}
            onMouseLeave={() => setRevamprHovered(false)}
          >
            Revampr.io
          </a>
        </div>

        {/* Middle row: SEO page links */}
        <nav style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px 20px',
          justifyContent: 'center',
          marginBottom: '24px',
        }}>
          {siteConfig.seoPages.map((page) => (
            <Link
              key={page.slug}
              to={`/${page.slug}`}
              style={{
                fontSize: '13px',
                color: '#666666',
                textDecoration: 'none',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#1A1A1A')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#666666')}
            >
              {page.h1}
            </Link>
          ))}
        </nav>

        {/* Bottom row: copyright + privacy */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
        }}>
          <span style={{ fontSize: '13px', color: '#AAAAAA' }}>
            © {currentYear} Revampr.io. All rights reserved.
          </span>
          <Link
            to="/privacy"
            style={{ fontSize: '13px', color: '#AAAAAA', textDecoration: 'none' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#666666')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#AAAAAA')}
          >
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
