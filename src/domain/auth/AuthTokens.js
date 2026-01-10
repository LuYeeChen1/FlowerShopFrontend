export class AuthTokens {
  constructor({
    accessToken,
    idToken,
    refreshToken,
    expiresIn,
    tokenType,
    receivedAt,
  }) {
    this.accessToken = accessToken;
    this.idToken = idToken;
    this.refreshToken = refreshToken;
    this.expiresIn = Number(expiresIn);
    this.tokenType = tokenType;
    this.receivedAt = Number(receivedAt);
  }

  isExpired(now = Date.now()) {
    if (!this.expiresIn || !this.receivedAt) {
      return true;
    }
    const bufferMs = 30 * 1000;
    return now >= this.receivedAt + this.expiresIn * 1000 - bufferMs;
  }

  toJSON() {
    return {
      accessToken: this.accessToken,
      idToken: this.idToken,
      refreshToken: this.refreshToken,
      expiresIn: this.expiresIn,
      tokenType: this.tokenType,
      receivedAt: this.receivedAt,
    };
  }

  static fromResponse(response) {
    return new AuthTokens({
      accessToken: response.access_token,
      idToken: response.id_token,
      refreshToken: response.refresh_token,
      expiresIn: response.expires_in,
      tokenType: response.token_type,
      receivedAt: Date.now(),
    });
  }

  static fromJSON(raw) {
    if (!raw) {
      return null;
    }
    return new AuthTokens(raw);
  }
}
