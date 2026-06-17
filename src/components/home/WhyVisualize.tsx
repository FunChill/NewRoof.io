import { siteConfig } from '../../config/siteConfig';

export function WhyVisualize() {
  return (
    <section style={{
      background: '#FAF9F7',
      padding: '80px 0',
    }}>
      <div className="container">
        <h2 style={{
          fontSize: '28px',
          fontWeight: 500,
          color: '#1A1A1A',
          textAlign: 'center',
          marginBottom: '48px',
        }}>
          Why Visualize First?
        </h2>

        <div style={{
          maxWidth: '640px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
        }}>
          {siteConfig.whyVisualize.map((block, i) => (
            <div key={i}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 500,
                color: '#1A1A1A',
                marginBottom: '10px',
              }}>
                {block.headline}
              </h3>
              <p style={{
                fontSize: '15px',
                fontWeight: 400,
                color: '#666666',
                lineHeight: 1.6,
              }}>
                {block.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
