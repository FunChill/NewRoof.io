const RAILWAY_URL = import.meta.env.VITE_RAILWAY_API_URL as string;

// ── Canvas compression + base64 encoding ────────────────────────────────────
export async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) { reject(new Error('Canvas not supported')); return; }

    const img = new Image();
    img.onload = () => {
      const MAX = 1920;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round((height * MAX) / width); width = MAX; }
        else { width = Math.round((width * MAX) / height); height = MAX; }
      }
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => { if (blob) resolve(blob); else reject(new Error('Compression failed')); },
        'image/jpeg',
        0.85
      );
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = URL.createObjectURL(file);
  });
}

/** Convert a Blob to a base64 data string (without the data: prefix). */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the "data:image/jpeg;base64," prefix — server only wants the raw base64
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// ── Railway render call ─────────────────────────────────────────────────────
// The Railway backend (/api/render) expects:
//   POST application/json
//   { prompt, imageBase64, imageMimeType, medium, userTier, userId,
//     renderMeta, _nonce, useProModel, secondaryImageBase64, secondaryImageMimeType }
// Returns JSON: { imageBase64: string, mimeType: string }
export async function generateRoofRender(
  imageFile: File,
  prompt: string
): Promise<Blob> {
  // 1. Compress image
  const compressed = await compressImage(imageFile);

  // 2. Convert to base64
  const imageBase64 = await blobToBase64(compressed);

  // 3. POST JSON to Railway
  const response = await fetch(`${RAILWAY_URL}/render`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify({
      prompt,
      imageBase64,
      imageMimeType: 'image/jpeg',
      medium: 'roofing',
      userTier: 'free',
      userId: null,
      renderMeta: { source: 'newroof' },
      _nonce: Date.now(),
      useProModel: false,
      secondaryImageBase64: null,
      secondaryImageMimeType: null,
    }),
  });

  if (response.status === 429) {
    throw new RateLimitError('Rate limited');
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `Render failed: ${response.status}`);
  }

  // 4. Server returns { imageBase64, mimeType } — decode back to Blob
  const result: { imageBase64: string; mimeType: string } = await response.json();

  if (!result.imageBase64 || !result.mimeType) {
    throw new Error('The AI did not return an image. Please try a different photo.');
  }

  // Convert base64 back to Blob for display
  const binary = atob(result.imageBase64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: result.mimeType });
}

// ── Custom error types ──────────────────────────────────────────────────────
export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitError';
  }
}
