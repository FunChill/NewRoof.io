import { useState } from 'react';
import { Link } from 'react-router-dom';

export function AboutPage() {
  const [linkHovered, setLinkHovered] = useState(false);

  return (
    <div style={{
      minHeight: 'calc(100vh - 128px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      padding: '48px 24px',
      textAlign: 'center',
      background: '#FAF9F7',
    }}>
      <div style={{ fontSize: '48px' }}>📖</div>
      <h1 style={{ fontSize: '28px', fontWeight: 500, color: '#1A1A1A' }}>
        About NewRoof
      </h1>
      <p style={{ fontSize: '16px', color: '#666666', maxWidth: '400px', lineHeight: 1.6 }}>
        About page coming in Task 3. NewRoof is built on Revampr's AI visualization engine — trusted by contractors, designers, and homeowners.
      </p>
      <Link
        to="/"
        style={{
          marginTop: '8px',
          fontSize: '15px',
          fontWeight: 500,
          color: linkHovered ? '#993C1D' : '#D85A30',
          textDecoration: 'none',
          transition: 'color 0.15s ease',
        }}
        onMouseEnter={() => setLinkHovered(true)}
        onMouseLeave={() => setLinkHovered(false)}
      >
        ← Back to Home
      </Link>
    </div>
  );
}
