import React from 'react';
import { Link } from 'react-router-dom';

interface CTAButtonProps {
  to?: string;
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'outline';
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}

export function CTAButton({
  to,
  href,
  onClick,
  children,
  variant = 'primary',
  fullWidth = false,
  size = 'md',
  style,
}: CTAButtonProps) {
  const paddingMap = {
    sm: '10px 20px',
    md: '14px 28px',
    lg: '16px 32px',
  };

  const fontSizeMap = {
    sm: '14px',
    md: '15px',
    lg: '16px',
  };

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: paddingMap[size],
    fontSize: fontSizeMap[size],
    fontWeight: 500,
    fontFamily: 'inherit',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.15s ease',
    border: 'none',
    textDecoration: 'none',
    width: fullWidth ? '100%' : undefined,
    ...(variant === 'primary' ? {
      background: '#D85A30',
      color: '#FFFFFF',
    } : {
      background: 'transparent',
      color: '#D85A30',
      border: '1.5px solid #D85A30',
    }),
    ...style,
  };

  const hoverStyle = {
    background: variant === 'primary' ? '#993C1D' : '#FAECE7',
  };

  const [isHovered, setIsHovered] = React.useState(false);

  const combinedStyle = isHovered
    ? { ...baseStyle, ...hoverStyle }
    : baseStyle;

  if (to) {
    return (
      <Link
        to={to}
        style={combinedStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        style={combinedStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      style={combinedStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
}
