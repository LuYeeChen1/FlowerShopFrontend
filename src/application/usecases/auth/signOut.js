import { AUTH_STORAGE_KEYS } from "../../constants/authStorageKeys";

export class SignOutUseCase {
  constructor({ authPort, storagePort }) {
    this.authPort = authPort;
    this.storagePort = storagePort;
  }

  execute() {
    this.storagePort.removeItem(AUTH_STORAGE_KEYS.tokens);
    this.storagePort.removeItem(AUTH_STORAGE_KEYS.state);
    this.storagePort.removeItem(AUTH_STORAGE_KEYS.codeVerifier);

    return this.authPort.buildLogoutUrl();
  }
}
