import { useState } from 'react';
import { Link } from 'react-router-dom';

export function FooterCTA() {
  const [btnHovered, setBtnHovered] = useState(false);

  return (
    <section style={{
      background: '#1A3A4A',
      padding: '64px 0',
      textAlign: 'center',
    }}>
      <div className="container">
        <h2 style={{
          fontSize: '28px',
          fontWeight: 500,
          color: '#FFFFFF',
          marginBottom: '24px',
        }}>
          Ready to See Your New Roof?
        </h2>

        <Link
          to="/visualize"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: btnHovered ? '#993C1D' : '#D85A30',
            color: '#FFFFFF',
            borderRadius: '8px',
            padding: '16px 32px',
            fontSize: '16px',
            fontWeight: 500,
            textDecoration: 'none',
            transition: 'background 0.15s ease',
            marginBottom: '14px',
          }}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
        >
          Upload Your House Photo
        </Link>

        <p style={{
          fontSize: '13px',
          color: '#B0C4CE',
          margin: 0,
        }}>
          3 free renders — no account needed
        </p>
      </div>
    </section>
  );
}
