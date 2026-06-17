import { useRef, useState, useEffect, useCallback } from 'react';

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  defaultPosition?: number;   // 0-100, default 75
  autoAnimate?: boolean;       // auto-slide from 50 to defaultPosition on load
  caption?: string;
  aspectRatio?: string;        // e.g. '16/10', default 'auto'
  borderRadius?: number;       // default 12
}

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  defaultPosition = 75,
  autoAnimate = false,
  caption,
  aspectRatio = 'auto',
  borderRadius = 12,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(autoAnimate ? 50 : defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const hasAnimated = useRef(false);
  // Touch direction detection
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isHorizontalDrag = useRef<boolean | null>(null);

  // Auto-animate from 50 to defaultPosition on mount
  useEffect(() => {
    if (!autoAnimate || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();
    const duration = 1500;
    const startPos = 50;
    const endPos = defaultPosition;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setPosition(startPos + (endPos - startPos) * eased);
      if (progress < 1) animationRef.current = requestAnimationFrame(animate);
    };

    const timer = setTimeout(() => {
      animationRef.current = requestAnimationFrame(animate);
    }, 200);

    return () => {
      clearTimeout(timer);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [autoAnimate, defaultPosition]);

  const getPositionFromX = useCallback((clientX: number) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
  }, []);

  // ── Mouse ────────────────────────────────────────────────────────────────
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    setIsDragging(true);
    setPosition(getPositionFromX(e.clientX));
  }, [getPositionFromX]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setPosition(getPositionFromX(e.clientX));
  }, [isDragging, getPositionFromX]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  // ── Touch ────────────────────────────────────────────────────────────────
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isHorizontalDrag.current = null; // undecided until first move
    // NOTE: Don't snap position on touchstart — wait for confirmed horizontal drag
    // so vertical scroll taps don't accidentally move the slider
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);

    // Determine drag direction on first significant move
    if (isHorizontalDrag.current === null && (dx > 3 || dy > 3)) {
      isHorizontalDrag.current = dx >= dy;
    }

    // Only handle if horizontal — let vertical scroll pass through
    if (isHorizontalDrag.current === true) {
      e.preventDefault();
      setIsDragging(true);
      setPosition(getPositionFromX(e.touches[0].clientX));
    }
  }, [getPositionFromX]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    isHorizontalDrag.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{
          position: 'relative',
          borderRadius: `${borderRadius}px`,
          overflow: 'hidden',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          aspectRatio: aspectRatio !== 'auto' ? aspectRatio : undefined,
          lineHeight: 0,
        }}
      >
        {/* Before image */}
        <img src={beforeSrc} alt="Before" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />

        {/* After image — clipped */}
        <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <img src={afterSrc} alt="After" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>

        {/* Divider line */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0,
          left: `${position}%`, transform: 'translateX(-50%)',
          width: '2px', background: '#D85A30', pointerEvents: 'none',
        }} />

        {/* Grabber handle */}
        <div style={{
          position: 'absolute',
          top: '50%', left: `${position}%`,
          transform: 'translate(-50%, -50%)',
          width: '40px', height: '40px', borderRadius: '50%',
          background: '#FFFFFF', border: '2px solid #D85A30',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          pointerEvents: 'none', zIndex: 2,
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M6 9H12M6 9L4 7M6 9L4 11M12 9L14 7M12 9L14 11" stroke="#D85A30" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Before / After labels */}
        <div style={{
          position: 'absolute', top: '10px', left: '12px',
          background: 'rgba(0,0,0,0.45)', color: '#fff',
          fontSize: '11px', fontWeight: 500, padding: '3px 8px', borderRadius: '4px', pointerEvents: 'none',
        }}>Before</div>
        <div style={{
          position: 'absolute', top: '10px', right: '12px',
          background: 'rgba(216,90,48,0.75)', color: '#fff',
          fontSize: '11px', fontWeight: 500, padding: '3px 8px', borderRadius: '4px', pointerEvents: 'none',
        }}>After</div>
      </div>

      {caption && (
        <p style={{ fontSize: '12px', color: '#B0C4CE', textAlign: 'center', margin: 0 }}>
          {caption}
        </p>
      )}
    </div>
  );
}
