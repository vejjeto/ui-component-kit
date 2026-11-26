export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface WcagEvaluation {
  ratio: number;
  aaNormal: boolean;
  aaLarge: boolean;
  aaaNormal: boolean;
  aaaLarge: boolean;
  grade: "AAA" | "AA" | "AA Large" | "Fail";
}

/** Parse a 3-digit or 6-digit hex color string into RGB channels (0-255). */
export function hexToRgb(hex: string): RgbColor | null {
  const clean = hex.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(clean)) {
    const r = Number.parseInt(clean.charAt(0).repeat(2), 16);
    const g = Number.parseInt(clean.charAt(1).repeat(2), 16);
    const b = Number.parseInt(clean.charAt(2).repeat(2), 16);
    return { r, g, b };
  }
  if (/^[0-9a-fA-F]{6}$/.test(clean)) {
    const r = Number.parseInt(clean.slice(0, 2), 16);
    const g = Number.parseInt(clean.slice(2, 4), 16);
    const b = Number.parseInt(clean.slice(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

function linearizeChannel(channel255: number): number {
  const srgb = channel255 / 255;
  return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
}

/** Compute WCAG 2.1 relative luminance (0.0 for black to 1.0 for white). */
export function relativeLuminance(rgb: RgbColor): number {
  const r = linearizeChannel(rgb.r);
  const g = linearizeChannel(rgb.g);
  const b = linearizeChannel(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Compute WCAG 2.1 contrast ratio between two hex colors (1 to 21). Returns 0 if either hex is invalid. */
export function contrastRatio(
  foregroundHex: string,
  backgroundHex: string,
): number {
  const fg = hexToRgb(foregroundHex);
  const bg = hexToRgb(backgroundHex);
  if (!fg || !bg) return 0;

  const lumA = relativeLuminance(fg);
  const lumB = relativeLuminance(bg);
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);

  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

/** Evaluate WCAG 2.1 AA/AAA compliance for normal (>=4.5 / >=7.0) and large (>=3.0 / >=4.5) text. */
export function evaluateWcagContrast(
  foregroundHex: string,
  backgroundHex: string,
): WcagEvaluation {
  const ratio = contrastRatio(foregroundHex, backgroundHex);
  const aaNormal = ratio >= 4.5;
  const aaLarge = ratio >= 3;
  const aaaNormal = ratio >= 7;
  const aaaLarge = ratio >= 4.5;

  const grade: WcagEvaluation["grade"] = aaaNormal
    ? "AAA"
    : aaNormal
      ? "AA"
      : aaLarge
        ? "AA Large"
        : "Fail";

  return {
    ratio,
    aaNormal,
    aaLarge,
    aaaNormal,
    aaaLarge,
    grade,
  };
}
