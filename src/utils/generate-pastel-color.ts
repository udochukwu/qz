export default function generatePastelColor(workspaceId: string) {
  function hslToRgb(h: number, s: number, l: number) {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(Math.min(k(n) - 3, 9 - k(n), 1), -1);

    return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
  }

  // Generate hash based on workspaceID
  let hash = 0;
  for (let i = 0; i < workspaceId.length; i++) {
    const char = workspaceId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  hash = Math.abs(hash);

  const h = hash % 360;

  const s = 50 + (hash % 20); // 50-70% saturation
  const l = 65 + (hash % 20); // 65-85% lightness
  const [r, g, b] = hslToRgb(h, s, l);
  return `rgb(${r},${g},${b})`;
}
