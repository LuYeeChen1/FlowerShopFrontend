import { AUTH_STORAGE_KEYS } from "../../constants/authStorageKeys";

export class StartAuthUseCase {
  constructor({ authPort, storagePort, cryptoPort }) {
    this.authPort = authPort;
    this.storagePort = storagePort;
    this.cryptoPort = cryptoPort;
  }

  async execute({ mode }) {
    const state = this.cryptoPort.generateRandomString();
    const codeVerifier = this.cryptoPort.generateRandomString();
    const codeChallenge = await this.cryptoPort.createCodeChallenge(codeVerifier);

    this.storagePort.setItem(AUTH_STORAGE_KEYS.state, state);
    this.storagePort.setItem(AUTH_STORAGE_KEYS.codeVerifier, codeVerifier);

    return this.authPort.buildAuthorizationUrl({
      mode,
      state,
      codeChallenge,
    });
  }
}
