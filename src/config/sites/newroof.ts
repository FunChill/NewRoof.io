import type { SiteConfig } from '../../types/site';

export const newroofConfig: SiteConfig = {
  id: 'newroof',
  name: 'NewRoof',
  domain: 'newroof.io',
  tagline: "See Your New Roof Before It's Installed",
  subTagline: 'Upload a photo. Pick a color. See it in 30 seconds.',
  revamprMedium: 'roofing',
  sourceParam: 'newroof',

  headerBrand: 'NewRoof by Revampr',
  footerPoweredBy: 'Powered by Revampr.io',

  freeRenderLimit: 3,
  renderWall: {
    headline: "You've Unlocked the Full Roofing Studio",
    body: 'Continue on Revampr to access every roofing material, advanced options, multi-image batch renders, client management tools, and premium project features.',
    ctaText: 'Claim Your 7 Free Renders →',
    ctaUrl: 'https://www.revampr.io/signup?source=newroof',
  },

  // ─── SIMPLE MODE — COLOR SWATCHES (primary selection) ───────────────────
  colorSwatches: [
    {
      id: 'charcoal-black',
      name: 'Charcoal Black',
      textureUrl: '/colors/charcoal-black.jpg',
      promptValue: 'charcoal black colored roof',
    },
    {
      id: 'slate-gray',
      name: 'Slate Gray',
      textureUrl: '/colors/slate-gray.jpg',
      promptValue: 'slate gray colored roof',
    },
    {
      id: 'weathered-wood',
      name: 'Weathered Wood',
      textureUrl: '/colors/weathered-wood.jpg',
      promptValue: 'weathered wood brown colored roof with warm brown tones',
    },
    {
      id: 'barkwood-brown',
      name: 'Barkwood Brown',
      textureUrl: '/colors/barkwood-brown.jpg',
      promptValue: 'dark barkwood brown colored roof',
    },
    {
      id: 'colonial-slate',
      name: 'Colonial Slate',
      textureUrl: '/colors/colonial-slate.jpg',
      promptValue: 'colonial slate blue-gray colored roof',
    },
    {
      id: 'driftwood',
      name: 'Driftwood',
      textureUrl: '/colors/driftwood.jpg',
      promptValue: 'light driftwood gray colored roof with soft warm undertones',
    },
    {
      id: 'hunter-green',
      name: 'Hunter Green',
      textureUrl: '/colors/hunter-green.jpg',
      promptValue: 'deep hunter green colored roof',
    },
    {
      id: 'aged-copper',
      name: 'Aged Copper',
      textureUrl: '/colors/aged-copper.jpg',
      promptValue: 'aged copper green patina colored roof',
    },
    {
      id: 'terracotta',
      name: 'Terracotta',
      textureUrl: '/colors/terracotta.jpg',
      promptValue: 'warm terracotta orange-red colored roof',
    },
  ],

  // ─── PRO MODE — MATERIAL CARDS (secondary selection) ────────────────────
  materials: [
    {
      id: 'asphalt-shingles',
      name: 'Asphalt Shingles',
      textureUrl: '/materials/asphalt-shingles.jpg',
      description: 'Standard 3-tab, most affordable',
      promptValue: 'standard 3-tab asphalt shingles',
    },
    {
      id: 'architectural-shingles',
      name: 'Architectural Shingles',
      textureUrl: '/materials/architectural-shingles.jpg',
      description: 'Dimensional, layered depth',
      promptValue: 'dimensional architectural asphalt shingles with layered depth and shadow lines',
    },
    {
      id: 'metal-standing-seam',
      name: 'Standing Seam Metal',
      textureUrl: '/materials/metal-standing-seam.jpg',
      description: 'Vertical panels, raised seams',
      promptValue: 'standing seam metal roofing with vertical panels and raised seams',
    },
    {
      id: 'metal-horizontal-snap-lock',
      name: 'Horizontal Snap-Lock Metal',
      textureUrl: '/materials/metal-snap-lock.jpg',
      description: 'Modern horizontal panels, concealed fasteners',
      promptValue: 'horizontal lap-seam metal roofing panels installed in overlapping horizontal rows — NOT standing seam, NOT vertical panels. Each panel runs horizontally across the roof with a clean flat profile and concealed fasteners. The result looks like horizontal wood siding but in metal. Modern, clean, low-profile horizontal lines running parallel to the ground across the entire roof surface.',
    },
    {
      id: 'metal-corrugated',
      name: 'Corrugated Metal',
      textureUrl: '/materials/metal-corrugated.jpg',
      description: 'Ribbed panels, rural/farmhouse',
      promptValue: 'corrugated metal roofing with ribbed panels',
    },
    {
      id: 'stone-coated-steel',
      name: 'Stone-Coated Steel',
      textureUrl: '/materials/stone-coated-steel.jpg',
      description: 'Granulated steel, mimics tile or shake',
      promptValue: 'stone-coated steel roofing with granulated texture mimicking traditional materials',
    },
    {
      id: 'slate',
      name: 'Natural Slate',
      textureUrl: '/materials/slate.jpg',
      description: 'Quarried stone, 100+ year lifespan',
      promptValue: 'natural slate roofing with quarried stone tiles',
    },
    {
      id: 'synthetic-slate',
      name: 'Synthetic Slate',
      textureUrl: '/materials/synthetic-slate.jpg',
      description: 'Polymer composite, lighter than real slate',
      promptValue: 'synthetic slate roofing with polymer composite tiles mimicking natural stone',
    },
    {
      id: 'cedar-shake',
      name: 'Cedar Shake',
      textureUrl: '/materials/cedar-shake.jpg',
      description: 'Natural wood, organic texture',
      promptValue: 'natural cedar shake roofing with split wood shingles and organic texture variation',
    },
    {
      id: 'clay-tile',
      name: 'Clay Tile',
      textureUrl: '/materials/clay-tile.jpg',
      description: 'Traditional barrel terracotta',
      promptValue: 'clay tile roofing with traditional barrel or S-shaped terracotta tiles',
    },
    {
      id: 'concrete-tile',
      name: 'Concrete Tile',
      textureUrl: '/materials/concrete-tile.jpg',
      description: 'Flat or profiled, durable',
      promptValue: 'concrete tile roofing with flat or profiled tiles',
    },
    {
      id: 'flat-tpo',
      name: 'Flat / TPO',
      textureUrl: '/materials/flat-tpo.jpg',
      description: 'Membrane, commercial/modern',
      promptValue: 'flat TPO membrane roofing with a smooth, light-colored surface',
    },
  ],

  // ─── PRO MODE — ADVANCED OPTIONS ────────────────────────────────────────
  advancedOptions: [
    {
      id: 'ridge-cap',
      label: 'Ridge Cap',
      helperText: 'How the peak and hip lines of your roof are finished',
      type: 'single-select',
      defaultValue: null,
      options: [
        { id: 'standard-matching', label: 'Standard matching', promptValue: 'Use standard matching ridge cap material along all ridges and hips.' },
        { id: 'high-profile', label: 'High-profile hip & ridge', promptValue: 'Use high-profile hip and ridge cap shingles for a premium raised ridge line.' },
        { id: 'metal-accent', label: 'Metal accent cap', promptValue: 'Use a contrasting metal ridge cap accent along the peak for a modern detail.' },
      ],
    },
    {
      id: 'gutter-style',
      label: 'Gutter Style',
      helperText: 'The style of gutters along the roofline',
      type: 'single-select',
      defaultValue: 'keep-existing',
      options: [
        { id: 'keep-existing', label: 'Keep existing', promptValue: '' },
        { id: 'half-round', label: 'Half-round', promptValue: 'Replace gutters with half-round style gutters for a classic curved profile.' },
        { id: 'k-style', label: 'K-style', promptValue: 'Replace gutters with K-style ogee gutters for a traditional detailed profile.' },
        { id: 'box-gutter', label: 'Box gutter', promptValue: 'Replace gutters with modern box-style gutters for a clean, squared profile.' },
      ],
    },
  ],

  // ─── HOW IT WORKS ───────────────────────────────────────────────────────
  howItWorks: [
    { icon: '📸', title: 'Upload', description: 'Snap a photo of your house — any angle works' },
    { icon: '🎨', title: 'Pick a Color', description: 'Choose from 9 roof color options' },
    { icon: '🏠', title: 'See Your New Roof', description: 'Get your AI render in 30 seconds' },
  ],

  // ─── WHY VISUALIZE ──────────────────────────────────────────────────────
  whyVisualize: [
    {
      headline: 'A shingle sample on your kitchen table tells you nothing.',
      body: "A 2-inch swatch can't show you how a roof color plays against your brick, your siding, your landscaping, and your neighbor's house. See the full picture — on YOUR house — before the crew shows up.",
    },
    {
      headline: 'Your client needs to see it, not imagine it.',
      body: "Contractors close faster when clients can see exactly what they're buying. Stop explaining. Start showing. One render replaces a hundred sample boards.",
    },
    {
      headline: 'Built on the engine pros trust.',
      body: "NewRoof is built on Revampr's AI visualization engine — trusted by contractors, designers, and homeowners to visualize before they commit.",
    },
  ],

  // ─── FAQ ────────────────────────────────────────────────────────────────
  faqItems: [
    {
      question: 'Is NewRoof free to use?',
      answer: 'Yes — you get 3 free roof renders with no account required. Upload a photo of your house, pick a roof color, and see the result in 30 seconds.',
    },
    {
      question: 'How accurate are the AI renders?',
      answer: "NewRoof uses Revampr's AI visualization engine to generate photorealistic renders based on your actual house photo. The AI preserves your roofline, pitch, chimneys, vents, and landscaping while transforming the roof to your chosen color and material.",
    },
    {
      question: 'Can I try different colors on the same photo?',
      answer: 'Absolutely. Upload once, then try as many of the 9 color options as you like. Each render counts toward your 3 free uses.',
    },
    {
      question: 'What happens after 3 free renders?',
      answer: 'After 3 renders, you can continue on Revampr.io — the full platform behind NewRoof. Revampr unlocks every roofing material, advanced options like ridge cap and gutter style, multi-image batch renders, client management tools, and premium project features.',
    },
    {
      question: 'Do I need to create an account?',
      answer: 'No account needed for your 3 free renders on NewRoof.io. If you continue to Revampr for more options and features, you can create a free account there.',
    },
    {
      question: 'Can contractors use this for client presentations?',
      answer: 'Yes — many roofing contractors use NewRoof to show clients exactly what a new roof will look like on their home before signing a contract. For full client management tools, PDF proposals, and shareable client links, continue to Revampr.io.',
    },
    {
      question: 'What photo should I upload?',
      answer: 'Any clear photo showing your roofline works — front of the house, angled view, or even a drone shot. Natural daylight gives the best results. The AI will preserve your house and transform only the roof.',
    },
    {
      question: 'Is this just a color filter?',
      answer: "No. NewRoof uses generative AI to rebuild your roof with realistic materials, lighting, shadows, and texture. It's not a color overlay — it's a full photorealistic visualization of what your house would look like with the selected roof.",
    },
  ],

  // ─── GALLERY ────────────────────────────────────────────────────────────
  galleryItems: [
    { id: 'g1', beforeUrl: '/gallery/before-1.jpg', afterUrl: '/gallery/after-1-charcoal.jpg', colorName: 'Charcoal Black', altText: 'Home with new charcoal black roof visualization' },
    { id: 'g2', beforeUrl: '/gallery/before-2.jpg', afterUrl: '/gallery/after-2-slate.jpg', colorName: 'Slate Gray', altText: 'Home with new slate gray roof visualization' },
    { id: 'g3', beforeUrl: '/gallery/before-3.jpg', afterUrl: '/gallery/after-3-weathered.jpg', colorName: 'Weathered Wood', altText: 'Home with new weathered wood roof visualization' },
    { id: 'g4', beforeUrl: '/gallery/before-4.jpg', afterUrl: '/gallery/after-4-copper.jpg', colorName: 'Aged Copper', altText: 'Home with new aged copper metal roof visualization' },
    { id: 'g5', beforeUrl: '/gallery/before-5.jpg', afterUrl: '/gallery/after-5-terracotta.jpg', colorName: 'Terracotta', altText: 'Home with new terracotta tile roof visualization' },
    { id: 'g6', beforeUrl: '/gallery/before-6.jpg', afterUrl: '/gallery/after-6-green.jpg', colorName: 'Hunter Green', altText: 'Home with new hunter green roof visualization' },
  ],

  // ─── SEO PAGES ──────────────────────────────────────────────────────────
  seoPages: [
    { slug: 'architectural-shingles', title: 'Architectural Shingles — See Them on Your Home', metaDescription: 'Visualize architectural shingles on your house before you buy. Upload a photo and get a free AI roof render in 30 seconds.', h1: 'Architectural Shingles' },
    { slug: 'metal-roofing', title: 'Metal Roofing — Visualize Before You Install', metaDescription: 'See what a metal roof looks like on your home. Standing seam, snap-lock, and corrugated options. Free AI render on NewRoof.io.', h1: 'Metal Roofing' },
    { slug: 'standing-seam-metal-roof', title: 'Standing Seam Metal Roof — See It on Your Home', metaDescription: 'Visualize a standing seam metal roof on your house with a free AI render. Upload a photo and see the result in 30 seconds.', h1: 'Standing Seam Metal Roof' },
    { slug: 'roof-color-visualizer', title: 'Roof Color Visualizer — Try Colors on Your House', metaDescription: 'Upload a photo of your home and see what different roof colors look like. Free AI roof color visualizer on NewRoof.io.', h1: 'Roof Color Visualizer' },
    { slug: 'cedar-shake-roof', title: 'Cedar Shake Roof — Visualize the Look', metaDescription: 'See what a cedar shake roof looks like on your house. Upload a photo for a free AI visualization on NewRoof.io.', h1: 'Cedar Shake Roof' },
  ],

  // ─── THEME ──────────────────────────────────────────────────────────────
  theme: {
    heroBackground: '#1A3A4A',     // deep blue-slate — daylight confidence, not dark moody
    heroTextColor: '#FFFFFF',
    heroSubTextColor: '#B0C4CE',
  },

  // ─── HERO IMAGES ────────────────────────────────────────────────────────
  heroBeforeImage: '/hero/before.jpg',
  heroAfterImage: '/hero/after.jpg',
};
