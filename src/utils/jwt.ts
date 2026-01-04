// src/utils/jwt.ts
// 作用：只做一件事——解码 JWT 的 payload（纯 UI 展示用途，不做验签）

export function decodeJwtPayload(token: string): any | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;

  const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));

  try {
    return JSON.parse(atob(b64 + pad));
  } catch {
    return null;
  }
}
