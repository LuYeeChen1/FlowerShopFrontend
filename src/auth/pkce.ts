// src/auth/pkce.ts
// 作用：生成 PKCE challenge
// 标准：challenge = base64url( SHA-256(verifier) )

// 将二进制数据转成 base64url（RFC 7636 要求）
function base64url(bytes: ArrayBuffer): string {
  const bin = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(bin)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// 根据 verifier 生成 challenge
export async function pkceChallenge(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64url(digest);
}
