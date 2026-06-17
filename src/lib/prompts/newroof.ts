import { siteConfig } from '../../config/siteConfig';

export interface NewRoofPromptConfig {
  colorId: string | null;
  materialId: string | null;
  ridgeCap: string | null;
  gutterStyle: string;
  notes: string;
  contractorNotes: string;
  surpriseMe: boolean;
}

export function buildNewRoofPrompt(config: NewRoofPromptConfig): string {
  if (config.surpriseMe) return buildSurprisePrompt();

  let prompt = 'Transform the roof of this house.';

  // Material
  if (config.materialId) {
    const material = siteConfig.materials.find(m => m.id === config.materialId);
    if (material) prompt += ` Use ${material.promptValue}.`;
  }

  // Color
  if (config.colorId) {
    const color = siteConfig.colorSwatches.find(c => c.id === config.colorId);
    if (color) prompt += ` Color: ${color.promptValue}.`;
  }

  // Ridge cap
  if (config.ridgeCap) {
    const group = siteConfig.advancedOptions.find(g => g.id === 'ridge-cap');
    const option = group?.options.find(o => o.id === config.ridgeCap);
    if (option?.promptValue) prompt += ` ${option.promptValue}`;
  }

  // Gutter style
  if (config.gutterStyle && config.gutterStyle !== 'keep-existing') {
    const group = siteConfig.advancedOptions.find(g => g.id === 'gutter-style');
    const option = group?.options.find(o => o.id === config.gutterStyle);
    if (option?.promptValue) prompt += ` ${option.promptValue}`;
  }

  // General notes
  if (config.notes.trim()) {
    prompt += ` Additional direction: ${config.notes.trim()}.`;
  }

  // Contractor notes
  if (config.contractorNotes.trim()) {
    prompt += ` Professional specifications: ${config.contractorNotes.trim()}.`;
  }

  // Hard constraint — always last
  prompt += ' CRITICAL CONSTRAINT — ROOF ONLY: Change ONLY the roof surface. Every other surface on this house must remain pixel-perfect identical to the original photo: the siding color, siding material, siding texture, and siding pattern must not change at all — do not re-color or re-texture any wall, siding panel, or facade surface. The window frames, trim, fascia, soffit, foundation walls, retaining walls, front steps, driveway, walkway, landscaping, planters, trees, grass, sky, and all surrounding environment must be preserved exactly as photographed. The roof color change must stop cleanly at the roof-edge and not bleed into any adjacent surface. Make the roof photorealistic with accurate material texture, lighting, and shadows matching the original photo lighting.';

  return prompt;
}

function buildSurprisePrompt(): string {
  const variations = [
    'Analyze this property carefully — its architectural style, neighborhood context, existing roof condition, and overall curb appeal. Recommend and render the single best realistic premium roofing upgrade using architectural dimensional shingles. Choose the most flattering color for this specific house. Keep the roof realistic and tasteful — not a fantasy.',
    'Study this house and its surroundings. Render it with a standing seam metal roof in the most complementary color for the property — consider the siding, brick, trim, and neighborhood. Preserve all existing roofline structure. Make it photorealistic.',
    'Look at this property and determine the most elegant realistic upgrade. Render it with premium cedar shake roofing in a natural weathered tone that suits the architecture. Keep proportions, pitch, and structure intact. Photorealistic result.',
    'Analyze the architectural style and context of this house. Render a natural slate or synthetic slate roof in a color that elevates the curb appeal — charcoal, blue-gray, or natural stone tone. Preserve all structural elements. Make it photorealistic.',
    'Study this property. Render it with horizontal snap-lock metal roofing panels in a modern dark tone — charcoal, dark bronze, or deep slate — that complements the house style. Keep roofline structure identical. Photorealistic with accurate metal sheen and shadow lines.',
    'Analyze this house carefully. Choose between stone-coated steel or architectural shingles — whichever suits the property better — and render it in the most complementary warm earth tone or neutral for this specific home. Preserve all structure. Make it photorealistic.',
  ];

  const variation = variations[Math.floor(Math.random() * variations.length)];
  return variation + ' CRITICAL CONSTRAINT — ROOF ONLY: Change ONLY the roof surface. The siding, walls, windows, trim, foundation, driveway, landscaping, and all surroundings must remain exactly as they appear in the photo. The roof color and material change must stop at the roof edge and not bleed into any wall or siding surface. Preserve the existing roofline, pitch, chimney positions, vents, and structural elements exactly. Make the roof photorealistic with accurate material texture and shadows matching the original photo lighting.';
}
