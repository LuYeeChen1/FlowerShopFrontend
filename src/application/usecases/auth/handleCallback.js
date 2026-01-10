import { AUTH_STORAGE_KEYS } from "../../constants/authStorageKeys";
import { AuthTokens } from "../../../domain/auth/AuthTokens";

export class HandleCallbackUseCase {
  constructor({ authPort, storagePort }) {
    this.authPort = authPort;
    this.storagePort = storagePort;
  }

  async execute({ code, state }) {
    if (!code) {
      throw new Error("Missing authorization code.");
    }

    const expectedState = this.storagePort.getItem(AUTH_STORAGE_KEYS.state);
    if (!expectedState || expectedState !== state) {
      throw new Error("Invalid state parameter.");
    }

    const codeVerifier = this.storagePort.getItem(AUTH_STORAGE_KEYS.codeVerifier);
    if (!codeVerifier) {
      throw new Error("Missing code verifier.");
    }

    const tokenResponse = await this.authPort.exchangeCodeForTokens({
      code,
      codeVerifier,
    });

    const tokens = AuthTokens.fromResponse(tokenResponse);
    this.storagePort.setItem(
      AUTH_STORAGE_KEYS.tokens,
      JSON.stringify(tokens.toJSON())
    );

    this.storagePort.removeItem(AUTH_STORAGE_KEYS.state);
    this.storagePort.removeItem(AUTH_STORAGE_KEYS.codeVerifier);

    return tokens;
  }
}
