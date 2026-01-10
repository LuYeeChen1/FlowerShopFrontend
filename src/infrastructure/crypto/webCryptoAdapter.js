const base64UrlEncode = (arrayBuffer) => {
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

export class WebCryptoAdapter {
  generateRandomString() {
    const bytes = new Uint8Array(32);
    window.crypto.getRandomValues(bytes);
    return base64UrlEncode(bytes);
  }

  async createCodeChallenge(codeVerifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest("SHA-256", data);
    return base64UrlEncode(digest);
  }
}
