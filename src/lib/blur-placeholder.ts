// Lightweight blur placeholder generator using CSS gradients
// Generates a subtle blur placeholder (1x1 SVG) for Image lazy-load
export function generateBlurPlaceholder(color = "#d4a574") {
  const svg = `
    <svg width="1" height="1" xmlns="http://www.w3.org/2000/svg">
      <rect fill="${color}" width="1" height="1"/>
    </svg>
  `;
  const base64 = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}

// For images, use CSS blur + low-quality mode in Image component
export const IMAGE_PLACEHOLDER_CONFIG = {
  blurColor: "#d4a574",
  quality: 30, // For blur effect during load
  priority: false, // Lazy-load by default
};
