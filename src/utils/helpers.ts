export function capitalizeFirstLetter(text: string) {
  if (!text) return ''; // Handle empty or null input
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export const lightenHexColor = (hex: string, percent: number): string => {
  // Ensure the hex is in a valid format
  hex = hex.replace(/^#/, '');

  // Convert hex to RGB
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Calculate the new RGB values by blending with white
  r = Math.min(255, Math.round(r + (255 - r) * (percent / 100)));
  g = Math.min(255, Math.round(g + (255 - g) * (percent / 100)));
  b = Math.min(255, Math.round(b + (255 - b) * (percent / 100)));

  // Convert back to hex and return
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
};

export const rgbStringToHex = (rgb: string): string => {
  // Extract numbers from the string using regex
  const match = rgb.match(/\d+/g);
  if (!match || match.length < 3) {
    throw new Error('Invalid RGB format. Expected format: rgb(R, G, B)');
  }

  // Parse values
  const [r, g, b] = match.map(Number);

  // Ensure values are within 0-255 range
  if ([r, g, b].some(val => val < 0 || val > 255)) {
    throw new Error('RGB values must be between 0 and 255');
  }

  // Convert each component to a 2-digit hex string
  const toHex = (c: number) => c.toString(16).padStart(2, '0').toUpperCase();

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};
