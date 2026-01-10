import { env } from "../config/env";

const buildUrl = (base, params) => {
  const url = new URL(base);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
};

export class CognitoAuthAdapter {
  constructor({ fetchImpl } = {}) {
    const baseFetch = fetchImpl || fetch;
    this.fetchImpl = (...args) => baseFetch(...args);
  }

  buildAuthorizationUrl({ mode, state, codeChallenge }) {
    return buildUrl(`${env.cognitoDomain}/oauth2/authorize`, {
      client_id: env.cognitoClientId,
      response_type: "code",
      redirect_uri: env.cognitoRedirectUri,
      scope: "openid email profile",
      state,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      screen_hint: mode === "signUp" ? "signup" : undefined,
    });
  }

  async exchangeCodeForTokens({ code, codeVerifier }) {
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: env.cognitoClientId,
      redirect_uri: env.cognitoRedirectUri,
      code,
      code_verifier: codeVerifier,
    });

    const response = await this.fetchImpl(`${env.cognitoDomain}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Token exchange failed: ${errorBody}`);
    }

    return response.json();
  }

  buildLogoutUrl() {
    return buildUrl(`${env.cognitoDomain}/logout`, {
      client_id: env.cognitoClientId,
      logout_uri: env.cognitoLogoutRedirectUri,
    });
  }
}
