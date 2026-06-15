/**
 * Generates a unique, human-readable certificate code.
 * Format: WP-YYYY-XXXXXXXX
 * Charset excludes ambiguous characters (0, O, I, 1, L) to avoid confusion.
 * Example: WP-2025-A3BF7C9D
 */
const SAFE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generateCertificateCode(): string {
  const year = new Date().getFullYear();
  let suffix = "";
  const array = new Uint8Array(8);

  // Use crypto.getRandomValues if available (browser/edge), else fallback
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // Node.js fallback
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const nodeCrypto = require("crypto") as typeof import("crypto");
    const buf = nodeCrypto.randomBytes(8);
    for (let i = 0; i < 8; i++) array[i] = buf[i];
  }

  for (let i = 0; i < 8; i++) {
    suffix += SAFE_CHARS[array[i] % SAFE_CHARS.length];
  }

  return `WP-${year}-${suffix}`;
}

export function buildValidationUrl(code: string): string {
  // NEXT_PUBLIC_CERT_BASE_URL should point to the Next.js app (Vercel), NOT windplus.com.br
  // windplus.com.br is a separate Hostinger SPA and cannot serve /validar/* routes
  const base =
    process.env.NEXT_PUBLIC_CERT_BASE_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://wind-plus.vercel.app";
  return `${base}/validar/${code}`;
}

export function qrCodeUrl(validationUrl: string, size = 200): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&format=svg&color=111111&data=${encodeURIComponent(validationUrl)}`;
}
