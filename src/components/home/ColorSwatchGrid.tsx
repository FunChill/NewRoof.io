import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../config/siteConfig';

export function ColorSwatchGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(
    new Array(siteConfig.colorSwatches.length).fill(false)
  );
  const hasTriggered = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasTriggered.current) {
          hasTriggered.current = true;
          siteConfig.colorSwatches.forEach((_, i) => {
            setTimeout(() => {
              setVisibleItems((prev) => {
                const next = [...prev];
                next[i] = true;
                return next;
              });
            }, i * 60);
          });
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#FFFFFF',
        padding: '80px 0',
      }}
    >
      <div className="container">
        {/* Label */}
        <p style={{
          fontSize: '12px',
          color: '#666666',
          letterSpacing: '0.05em',
          textAlign: 'center',
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}>
          Pick Your Color
        </p>

        {/* Heading */}
        <h2 style={{
          fontSize: '28px',
          fontWeight: 500,
          color: '#1A1A1A',
          textAlign: 'center',
          marginBottom: '48px',
        }}>
          9 Roof Colors — See Yours in Seconds
        </h2>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          maxWidth: '720px',
          margin: '0 auto',
        }}>
          {siteConfig.colorSwatches.map((swatch, i) => (
            <SwatchCard
              key={swatch.id}
              swatch={swatch}
              visible={visibleItems[i]}
            />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .swatch-grid {
            gap: 10px !important;
          }
        }
      `}</style>
    </section>
  );
}

function SwatchCard({
  swatch,
  visible,
}: {
  swatch: typeof siteConfig.colorSwatches[0];
  visible: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/visualize?color=${swatch.id}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        padding: '20px 12px',
        background: '#FFFFFF',
        border: `1.5px solid ${hovered ? '#D85A30' : '#E8E5E0'}`,
        borderRadius: '12px',
        textDecoration: 'none',
        cursor: 'pointer',
        transform: visible
          ? hovered ? 'scale(1.03)' : 'scale(1) translateY(0)'
          : 'translateY(30px)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.3s ease, opacity 0.4s ease, border-color 0.2s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Circular swatch */}
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        <img
          src={swatch.textureUrl}
          alt={swatch.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>

      {/* Color name */}
      <span style={{
        fontSize: '14px',
        fontWeight: 500,
        color: '#1A1A1A',
        textAlign: 'center',
      }}>
        {swatch.name}
      </span>
    </Link>
  );
}
