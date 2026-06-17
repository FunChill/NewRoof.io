import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { siteConfig } from '../config/siteConfig';
import { BeforeAfterSlider } from '../components/shared/BeforeAfterSlider';
import { buildNewRoofPrompt } from '../lib/prompts/newroof';
import { generateRoofRender, RateLimitError } from '../lib/api';

// ── Render counter helpers ──────────────────────────────────────────────────
const STORAGE_KEY = 'nr_renders_used';
const FREE_LIMIT = siteConfig.freeRenderLimit;

function getRendersUsed(): number {
  return parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
}
function incrementRenders(): void {
  localStorage.setItem(STORAGE_KEY, String(getRendersUsed() + 1));
}

// ── File validation ─────────────────────────────────────────────────────────
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 10;

function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) return 'Please upload a JPG, PNG, or WebP image.';
  if (file.size > MAX_SIZE_MB * 1024 * 1024) return `That image is too large. Please use a photo under ${MAX_SIZE_MB}MB.`;
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════
export function VisualizePage() {
  // Upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Simple Mode
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);

  // Pro Mode
  const [proModeOpen, setProModeOpen] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);
  const [selectedRidgeCap, setSelectedRidgeCap] = useState<string | null>(null);
  const [selectedGutterStyle, setSelectedGutterStyle] = useState<string>('keep-existing');
  const [contractorNotes, setContractorNotes] = useState('');

  // Shared
  const [generalNotes, setGeneralNotes] = useState('');
  const [surpriseMe, setSurpriseMe] = useState(false);

  // Render state
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [rendersUsed, setRendersUsed] = useState(getRendersUsed());
  const [renderError, setRenderError] = useState<string | null>(null);

  const resultPanelRef = useRef<HTMLDivElement>(null);

  // Read ?color= param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const colorParam = params.get('color');
    if (colorParam && siteConfig.colorSwatches.find(c => c.id === colorParam)) {
      setSelectedColorId(colorParam);
    }
  }, []);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (uploadedPreviewUrl) URL.revokeObjectURL(uploadedPreviewUrl);
      if (resultImageUrl) URL.revokeObjectURL(resultImageUrl);
      if (originalImageUrl) URL.revokeObjectURL(originalImageUrl);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── File handling ───────────────────────────────────────────────────────
  const handleFile = useCallback((file: File) => {
    const error = validateFile(file);
    if (error) { setUploadError(error); return; }
    setUploadError(null);
    if (uploadedPreviewUrl) URL.revokeObjectURL(uploadedPreviewUrl);
    setUploadedFile(file);
    setUploadedPreviewUrl(URL.createObjectURL(file));
    setResultImageUrl(null);
    setOriginalImageUrl(null);
    setRenderError(null);
  }, [uploadedPreviewUrl]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const removeFile = useCallback(() => {
    if (uploadedPreviewUrl) URL.revokeObjectURL(uploadedPreviewUrl);
    setUploadedFile(null);
    setUploadedPreviewUrl(null);
    setResultImageUrl(null);
    setOriginalImageUrl(null);
    setUploadError(null);
  }, [uploadedPreviewUrl]);

  // ── Render ──────────────────────────────────────────────────────────────
  const handleRender = useCallback(async () => {
    if (!uploadedFile || isGenerating) return;
    setIsGenerating(true);
    setRenderError(null);

    // Snapshot original for the before/after slider
    const originalUrl = URL.createObjectURL(uploadedFile);
    setOriginalImageUrl(originalUrl);

    try {
      const prompt = buildNewRoofPrompt({
        colorId: selectedColorId,
        materialId: selectedMaterialId,
        ridgeCap: selectedRidgeCap,
        gutterStyle: selectedGutterStyle,
        notes: generalNotes,
        contractorNotes,
        surpriseMe,
      });

      const blob = await generateRoofRender(uploadedFile, prompt);

      if (resultImageUrl) URL.revokeObjectURL(resultImageUrl);
      setResultImageUrl(URL.createObjectURL(blob));

      // Increment counter on success
      incrementRenders();
      setRendersUsed(getRendersUsed());

      // Mobile: scroll to result panel
      if (window.innerWidth < 768 && resultPanelRef.current) {
        setTimeout(() => {
          resultPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } catch (err) {
      URL.revokeObjectURL(originalUrl);
      setOriginalImageUrl(null);
      if (err instanceof RateLimitError) {
        setRenderError("You've generated several renders quickly. Please wait a moment and try again.");
      } else {
        setRenderError('Something went wrong. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  }, [
    uploadedFile, isGenerating, selectedColorId, selectedMaterialId,
    selectedRidgeCap, selectedGutterStyle, generalNotes, contractorNotes,
    surpriseMe, resultImageUrl,
  ]);

  // ── Download ────────────────────────────────────────────────────────────
  const handleDownload = useCallback(() => {
    if (!resultImageUrl) return;
    const a = document.createElement('a');
    a.href = resultImageUrl;
    a.download = `newroof-render-${Date.now()}.jpg`;
    a.click();
  }, [resultImageUrl]);

  // ── Derived ─────────────────────────────────────────────────────────────
  const atLimit = rendersUsed >= FREE_LIMIT;
  const remaining = Math.max(0, FREE_LIMIT - rendersUsed);
  const canRender = !!uploadedFile && !isGenerating && !atLimit;

  const selectedColor = siteConfig.colorSwatches.find(c => c.id === selectedColorId);
  const selectedMaterial = siteConfig.materials.find(m => m.id === selectedMaterialId);

  // ── Render wall (full right panel) ─────────────────────────────────────
  const renderWallPanel = (
    <div style={{
      background: '#FFFFFF',
      border: '1.5px solid #E8E5E0',
      borderRadius: '12px',
      padding: '32px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    }}>
      <div style={{ fontSize: '40px' }}>🎉</div>
      <h2 style={{ fontSize: '22px', fontWeight: 500, color: '#1A1A1A' }}>
        {siteConfig.renderWall.headline}
      </h2>
      <p style={{ fontSize: '15px', color: '#666666', lineHeight: 1.6 }}>
        {siteConfig.renderWall.body}
      </p>
      <a
        href={siteConfig.renderWall.ctaUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'block',
          width: '100%',
          background: '#D85A30',
          color: '#FFFFFF',
          borderRadius: '8px',
          padding: '16px',
          fontSize: '16px',
          fontWeight: 500,
          textAlign: 'center',
          textDecoration: 'none',
          boxSizing: 'border-box',
        }}
      >
        {siteConfig.renderWall.ctaText}
      </a>
      <p style={{ fontSize: '14px', color: '#666666', textAlign: 'center' }}>
        Already have an account?{' '}
        <a
          href={`https://www.revampr.io/login?source=${siteConfig.sourceParam}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#D85A30', textDecoration: 'none', fontWeight: 500 }}
        >
          Sign in
        </a>
      </p>
    </div>
  );

  // ── Result panel content ────────────────────────────────────────────────
  const resultPanelContent = (() => {
    if (atLimit && !resultImageUrl) return renderWallPanel;

    if (isGenerating) {
      return (
        <div style={{
          border: '1.5px dashed #D85A30',
          borderRadius: '12px',
          background: '#FFFFFF',
          aspectRatio: '4/3',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          animation: 'pulse-border 1.5s ease-in-out infinite',
        }}>
          <Spinner />
          <p style={{ fontSize: '14px', color: '#666666', margin: 0 }}>Generating your render...</p>
          <style>{`
            @keyframes pulse-border {
              0%, 100% { border-color: #D85A30; }
              50% { border-color: #FAECE7; }
            }
          `}</style>
        </div>
      );
    }

    if (resultImageUrl && originalImageUrl) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <BeforeAfterSlider
            beforeSrc={originalImageUrl}
            afterSrc={resultImageUrl}
            defaultPosition={50}
            aspectRatio="4/3"
            borderRadius={12}
            caption="Drag to compare"
          />
          {/* Info row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#666666' }}>
              {[selectedColor?.name, selectedMaterial?.name].filter(Boolean).join(' · ') || 'AI choice'}
            </span>
            <span style={{ fontSize: '13px', color: '#AAAAAA' }}>
              {rendersUsed} of {FREE_LIMIT} free renders used
            </span>
          </div>
          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <ActionButton onClick={handleDownload} variant="outline">
              Download
            </ActionButton>
            <ActionButton
              onClick={() => { setSelectedColorId(null); setResultImageUrl(null); setOriginalImageUrl(null); }}
              variant="warm"
            >
              Try Another Color
            </ActionButton>
          </div>
          {atLimit && (
            <div style={{ marginTop: '8px' }}>
              {renderWallPanel}
            </div>
          )}
        </div>
      );
    }

    // Empty state
    return (
      <div style={{
        border: '1.5px dashed #E8E5E0',
        borderRadius: '12px',
        background: '#FFFFFF',
        aspectRatio: '4/3',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '32px',
      }}>
        <span style={{ fontSize: '48px' }}>🏠</span>
        <p style={{ fontSize: '16px', fontWeight: 500, color: '#AAAAAA', textAlign: 'center', margin: 0 }}>
          Your render will appear here
        </p>
        <p style={{ fontSize: '14px', color: '#AAAAAA', textAlign: 'center', margin: 0 }}>
          Upload a photo and pick a color<br />to see your new roof in seconds
        </p>
      </div>
    );
  })();

  return (
    <>
      <Helmet>
        <title>Roof Visualizer — Try Colors &amp; Materials | NewRoof</title>
        <meta name="description" content="Upload your house photo and visualize a new roof in 30 seconds. 9 colors and 12 roofing materials. Free — no account needed." />
        <link rel="canonical" href="https://newroof.io/visualize" />
        <meta property="og:url" content="https://newroof.io/visualize" />
        <meta property="og:title" content="Roof Visualizer — Try Colors &amp; Materials | NewRoof" />
        <meta property="og:description" content="Upload your house photo and visualize a new roof in 30 seconds. Free — no account needed." />
        <meta property="og:image" content="https://newroof.io/og-image.jpg" />
      </Helmet>

      <div style={{ background: '#FAF9F7', minHeight: 'calc(100vh - 64px)', padding: '32px 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 45fr) minmax(0, 55fr)',
            gap: '32px',
            alignItems: 'start',
          }} className="viz-grid">

            {/* ══ LEFT: UPLOAD PANEL ══════════════════════════════════════ */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              opacity: atLimit ? 0.6 : 1,
              transition: 'opacity 0.2s',
            }}>

              {/* Upload drop zone */}
              <UploadZone
                isDragOver={isDragOver}
                previewUrl={uploadedPreviewUrl}
                error={uploadError}
                onFileSelect={handleFileInput}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onRemove={removeFile}
              />

              {/* Color section header + render counter */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#666666', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Pick a Color
                </span>
                <span style={{ fontSize: '13px', color: '#AAAAAA' }}>
                  {remaining > 0 ? `${remaining} free render${remaining !== 1 ? 's' : ''} remaining` : 'No free renders left'}
                </span>
              </div>

              {/* Color swatch grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                opacity: surpriseMe ? 0.4 : 1,
                pointerEvents: surpriseMe ? 'none' : undefined,
                transition: 'opacity 0.2s',
              }}>
                {siteConfig.colorSwatches.map(swatch => (
                  <ColorSwatchCard
                    key={swatch.id}
                    swatch={swatch}
                    selected={selectedColorId === swatch.id}
                    onSelect={() => setSelectedColorId(prev => prev === swatch.id ? null : swatch.id)}
                  />
                ))}
              </div>

              {/* Pro Options toggle */}
              <div style={{
                opacity: surpriseMe ? 0.4 : 1,
                pointerEvents: surpriseMe ? 'none' : undefined,
                transition: 'opacity 0.2s',
              }}>
                <ProOptionsToggle
                  open={proModeOpen}
                  onToggle={() => setProModeOpen(p => !p)}
                  selectedMaterialId={selectedMaterialId}
                  onMaterialSelect={setSelectedMaterialId}
                  selectedRidgeCap={selectedRidgeCap}
                  onRidgeCapSelect={setSelectedRidgeCap}
                  selectedGutterStyle={selectedGutterStyle}
                  onGutterStyleSelect={setSelectedGutterStyle}
                  contractorNotes={contractorNotes}
                  onContractorNotesChange={setContractorNotes}
                />
              </div>

              {/* General notes */}
              <div>
                <input
                  type="text"
                  placeholder='e.g. "Match the brick color, keep gutters as-is"'
                  value={generalNotes}
                  onChange={e => setGeneralNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '14px',
                    color: '#1A1A1A',
                    background: '#FAF9F7',
                    border: '1.5px solid #E8E5E0',
                    borderRadius: '8px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#D85A30')}
                  onBlur={e => (e.target.style.borderColor = '#E8E5E0')}
                />
              </div>

              {/* Surprise Me */}
              <SurpriseMeButton active={surpriseMe} onToggle={() => setSurpriseMe(p => !p)} />

              {/* Primary CTA */}
              {atLimit ? (
                <a
                  href={siteConfig.renderWall.ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    width: '100%',
                    background: '#D85A30',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    padding: '16px',
                    fontSize: '16px',
                    fontWeight: 500,
                    textAlign: 'center',
                    textDecoration: 'none',
                    boxSizing: 'border-box',
                  }}
                >
                  Get More Renders on Revampr →
                </a>
              ) : (
                <button
                  onClick={handleRender}
                  disabled={!canRender}
                  style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: '16px',
                    fontWeight: 500,
                    fontFamily: 'inherit',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: canRender ? 'pointer' : 'not-allowed',
                    background: canRender ? '#D85A30' : '#E8E5E0',
                    color: canRender ? '#FFFFFF' : '#AAAAAA',
                    transition: 'background 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxSizing: 'border-box',
                  }}
                  onMouseEnter={e => { if (canRender) (e.currentTarget as HTMLButtonElement).style.background = '#993C1D'; }}
                  onMouseLeave={e => { if (canRender) (e.currentTarget as HTMLButtonElement).style.background = '#D85A30'; }}
                >
                  {isGenerating ? (
                    <><Spinner size={18} color="#FFFFFF" /><span>Generating your render...</span></>
                  ) : (
                    'See My New Roof'
                  )}
                </button>
              )}

              {/* Render error */}
              {renderError && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <p style={{ fontSize: '14px', color: '#666666', margin: 0 }}>{renderError}</p>
                  <button
                    onClick={() => setRenderError(null)}
                    style={{
                      alignSelf: 'flex-start',
                      fontSize: '13px',
                      color: '#D85A30',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      fontFamily: 'inherit',
                    }}
                  >
                    Try again
                  </button>
                </div>
              )}
            </div>

            {/* ══ RIGHT: RESULT PANEL ═════════════════════════════════════ */}
            <div ref={resultPanelRef}>
              {resultPanelContent}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .viz-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Sub-components
// ═══════════════════════════════════════════════════════════════════════════

function UploadZone({
  isDragOver,
  previewUrl,
  error,
  onFileSelect,
  onDrop,
  onDragOver,
  onDragLeave,
  onRemove,
}: {
  isDragOver: boolean;
  previewUrl: string | null;
  error: string | null;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onRemove: () => void;
}) {
  return (
    <div>
      <label
        htmlFor="house-photo-input"
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        style={{
          display: 'block',
          cursor: 'pointer',
          border: `2px dashed ${isDragOver ? '#993C1D' : '#D85A30'}`,
          borderRadius: '12px',
          background: isDragOver ? '#FAECE7' : '#FFF8F5',
          padding: '32px 24px',
          textAlign: 'center',
          transition: 'background 0.15s, border-color 0.15s',
        }}
      >
        {previewUrl ? (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={previewUrl}
              alt="House preview"
              style={{ maxHeight: '120px', borderRadius: '8px', display: 'block' }}
            />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '36px' }}>🏠</span>
            <p style={{ fontSize: '16px', fontWeight: 500, color: '#1A1A1A', margin: 0 }}>
              Upload your house photo
            </p>
            <p style={{ fontSize: '14px', color: '#666666', margin: 0 }}>
              Any angle showing the roof
            </p>
            <p style={{ fontSize: '12px', color: '#AAAAAA', margin: 0 }}>
              .jpg .png .webp accepted
            </p>
          </div>
        )}
        <input
          id="house-photo-input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: 'none' }}
          onChange={onFileSelect}
        />
      </label>

      {/* Remove button when preview exists */}
      {previewUrl && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
          <button
            onClick={e => { e.preventDefault(); onRemove(); }}
            style={{
              fontSize: '13px',
              color: '#666666',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              textDecoration: 'underline',
            }}
          >
            × Remove photo
          </button>
        </div>
      )}

      {error && (
        <p style={{ fontSize: '13px', color: '#D85A30', marginTop: '8px', marginBottom: 0 }}>
          {error}
        </p>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
function ColorSwatchCard({
  swatch,
  selected,
  onSelect,
}: {
  swatch: typeof siteConfig.colorSwatches[0];
  selected: boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 8px',
        background: '#FFFFFF',
        border: `2px solid ${selected || hovered ? '#D85A30' : '#E8E5E0'}`,
        borderRadius: '10px',
        cursor: 'pointer',
        transform: selected ? 'scale(1.05)' : 'scale(1)',
        transition: 'border-color 0.15s, transform 0.15s',
        fontFamily: 'inherit',
      }}
    >
      <div style={{ width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
        <img src={swatch.textureUrl} alt={swatch.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
      <span style={{ fontSize: '12px', fontWeight: 500, color: '#1A1A1A', textAlign: 'center', lineHeight: 1.2 }}>
        {swatch.name}
      </span>
    </button>
  );
}

// ──────────────────────────────────────────────────────────────────────────
function ProOptionsToggle({
  open,
  onToggle,
  selectedMaterialId,
  onMaterialSelect,
  selectedRidgeCap,
  onRidgeCapSelect,
  selectedGutterStyle,
  onGutterStyleSelect,
  contractorNotes,
  onContractorNotesChange,
}: {
  open: boolean;
  onToggle: () => void;
  selectedMaterialId: string | null;
  onMaterialSelect: (id: string | null) => void;
  selectedRidgeCap: string | null;
  onRidgeCapSelect: (id: string | null) => void;
  selectedGutterStyle: string;
  onGutterStyleSelect: (id: string) => void;
  contractorNotes: string;
  onContractorNotesChange: (v: string) => void;
}) {
  const ridgeGroup = siteConfig.advancedOptions.find(g => g.id === 'ridge-cap')!;
  const gutterGroup = siteConfig.advancedOptions.find(g => g.id === 'gutter-style')!;

  return (
    <div>
      {/* Toggle row */}
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 0',
          background: 'none',
          border: 'none',
          borderTop: '1px solid #E8E5E0',
          borderBottom: open ? 'none' : '1px solid #E8E5E0',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        <span style={{ fontSize: '14px', fontWeight: 500, color: '#666666', display: 'flex', alignItems: 'center', gap: '6px' }}>
          ⚙️ Pro Options
        </span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.25s ease',
          color: '#666666',
        }}>
          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Expanded content */}
      <div style={{
        overflow: 'hidden',
        maxHeight: open ? '2000px' : '0',
        transition: 'max-height 0.25s ease',
        borderBottom: open ? '1px solid #E8E5E0' : 'none',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '16px', paddingBottom: '16px' }}>

          {/* Material selection */}
          <div>
            <p style={{ fontSize: '12px', color: '#666666', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '10px' }}>
              Material
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
              {siteConfig.materials.map(mat => (
                <MaterialCard
                  key={mat.id}
                  material={mat}
                  selected={selectedMaterialId === mat.id}
                  onSelect={() => onMaterialSelect(selectedMaterialId === mat.id ? null : mat.id)}
                />
              ))}
            </div>
            <p style={{ fontSize: '12px', color: '#AAAAAA', marginTop: '8px' }}>
              Leave unselected — AI matches what it sees in your photo
            </p>
          </div>

          {/* Ridge Cap */}
          <OptionChipGroup
            group={ridgeGroup}
            selectedId={selectedRidgeCap}
            onSelect={id => onRidgeCapSelect(selectedRidgeCap === id ? null : id)}
            allowNone
          />

          {/* Gutter Style */}
          <OptionChipGroup
            group={gutterGroup}
            selectedId={selectedGutterStyle}
            onSelect={onGutterStyleSelect}
          />

          {/* Contractor Notes */}
          <div>
            <p style={{ fontSize: '12px', color: '#666666', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Contractor Notes
            </p>
            <textarea
              rows={3}
              placeholder='e.g. "GAF Timberline HDZ, Weathered Wood, match existing fascia"'
              value={contractorNotes}
              onChange={e => onContractorNotesChange(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '14px',
                color: '#1A1A1A',
                background: '#FAF9F7',
                border: '1.5px solid #E8E5E0',
                borderRadius: '8px',
                fontFamily: 'inherit',
                resize: 'vertical',
                boxSizing: 'border-box',
                outline: 'none',
              }}
              onFocus={e => (e.target.style.borderColor = '#D85A30')}
              onBlur={e => (e.target.style.borderColor = '#E8E5E0')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
function MaterialCard({
  material,
  selected,
  onSelect,
}: {
  material: typeof siteConfig.materials[0];
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 12px',
        background: selected ? '#FAECE7' : '#FFFFFF',
        border: `1.5px solid ${selected ? '#D85A30' : '#E8E5E0'}`,
        borderRadius: '8px',
        cursor: 'pointer',
        fontFamily: 'inherit',
        textAlign: 'left',
        transition: 'border-color 0.15s, background 0.15s',
      }}
    >
      <div style={{ width: '48px', height: '48px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
        <img src={material.textureUrl} alt={material.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: '13px', fontWeight: 500, color: '#1A1A1A', margin: 0, lineHeight: 1.3 }}>
          {material.name}
        </p>
        <p style={{ fontSize: '11px', color: '#666666', margin: 0, lineHeight: 1.3 }}>
          {material.description}
        </p>
      </div>
    </button>
  );
}

// ──────────────────────────────────────────────────────────────────────────
function OptionChipGroup({
  group,
  selectedId,
  onSelect,
  allowNone = false,
}: {
  group: typeof siteConfig.advancedOptions[0];
  selectedId: string | null;
  onSelect: (id: string) => void;
  allowNone?: boolean;
}) {
  return (
    <div>
      <p style={{ fontSize: '12px', color: '#666666', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '4px' }}>
        {group.label}
      </p>
      <p style={{ fontSize: '11px', color: '#AAAAAA', marginBottom: '10px' }}>
        {group.helperText}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {group.options.map(opt => {
          const selected = selectedId === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => allowNone && selected ? onSelect('') : onSelect(opt.id)}
              style={{
                padding: '8px 14px',
                fontSize: '13px',
                fontFamily: 'inherit',
                borderRadius: '20px',
                cursor: 'pointer',
                border: `1.5px solid ${selected ? '#D85A30' : '#E8E5E0'}`,
                background: selected ? '#FAECE7' : '#FFFFFF',
                color: selected ? '#993C1D' : '#666666',
                transition: 'all 0.15s',
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
function SurpriseMeButton({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        padding: '12px',
        fontSize: '14px',
        fontWeight: 500,
        fontFamily: 'inherit',
        borderRadius: '8px',
        cursor: 'pointer',
        border: `1.5px dashed #D85A30`,
        background: active ? '#FAECE7' : hovered ? '#FFF8F5' : 'transparent',
        color: '#D85A30',
        transition: 'background 0.15s',
        boxSizing: 'border-box',
      }}
    >
      ✨ Surprise Me {active ? '(active — click to cancel)' : ''}
    </button>
  );
}

// ──────────────────────────────────────────────────────────────────────────
function ActionButton({
  onClick,
  children,
  variant,
}: {
  onClick: () => void;
  children: React.ReactNode;
  variant: 'outline' | 'warm';
}) {
  const [hovered, setHovered] = useState(false);
  const styles: React.CSSProperties =
    variant === 'outline'
      ? {
          background: hovered ? '#FAF9F7' : '#FFFFFF',
          border: '1.5px solid #E8E5E0',
          color: '#1A1A1A',
        }
      : {
          background: hovered ? '#F5E0D8' : '#FAECE7',
          border: `1.5px solid #D85A30`,
          color: '#D85A30',
        };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '10px 20px',
        fontSize: '14px',
        fontFamily: 'inherit',
        fontWeight: 500,
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background 0.15s',
        ...styles,
      }}
    >
      {children}
    </button>
  );
}

// ──────────────────────────────────────────────────────────────────────────
function Spinner({ size = 20, color = '#D85A30' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: 'spin 0.8s linear infinite', flexShrink: 0 }}
    >
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2.5" strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round" />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}


