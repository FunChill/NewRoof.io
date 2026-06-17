import { siteConfig } from '../../config/siteConfig';

export function HowItWorks() {
  return (
    <section style={{
      background: '#FFF8F5',
      padding: '64px 0',
    }}>
      <div className="container">
        <h2 style={{
          fontSize: '24px',
          fontWeight: 500,
          color: '#1A1A1A',
          textAlign: 'center',
          marginBottom: '48px',
        }}>
          How It Works
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '32px',
        }}
          className="how-it-works-grid"
        >
          {siteConfig.howItWorks.map((step) => (
            <div
              key={step.title}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '12px',
              }}
            >
              <span style={{ fontSize: '40px', lineHeight: 1 }}>{step.icon}</span>
              <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#1A1A1A' }}>
                {step.title}
              </h3>
              <p style={{ fontSize: '14px', fontWeight: 400, color: '#666666', lineHeight: 1.5 }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .how-it-works-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </section>
  );
}
