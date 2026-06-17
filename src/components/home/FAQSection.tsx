import { useState } from 'react';
import { siteConfig } from '../../config/siteConfig';

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const toggle = (i: number) => {
    setOpenIndex((prev) => (prev === i ? -1 : i));
  };

  return (
    <section style={{
      background: '#FFFFFF',
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
          Frequently Asked Questions
        </h2>

        <div style={{
          maxWidth: '720px',
          margin: '0 auto',
        }}>
          {siteConfig.faqItems.map((item, i) => (
            <FAQItem
              key={i}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
              isLast={i === siteConfig.faqItems.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
  isLast,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  isLast: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{
      borderBottom: isLast ? 'none' : '1px solid #E8E5E0',
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          padding: '20px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          color: hovered ? '#D85A30' : '#1A1A1A',
          transition: 'color 0.15s ease',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span style={{ fontSize: '16px', fontWeight: 500, flex: 1 }}>
          {question}
        </span>
        {/* Chevron */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          style={{
            flexShrink: 0,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s ease',
            color: isOpen ? '#D85A30' : '#666666',
          }}
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Answer — smooth expand/collapse */}
      <div style={{
        overflow: 'hidden',
        maxHeight: isOpen ? '600px' : '0',
        transition: 'max-height 0.25s ease',
      }}>
        <p style={{
          fontSize: '15px',
          fontWeight: 400,
          color: '#666666',
          lineHeight: 1.6,
          paddingBottom: '20px',
        }}>
          {answer}
        </p>
      </div>
    </div>
  );
}
