import { AUTH_STORAGE_KEYS } from "../../constants/authStorageKeys";
import { AuthTokens } from "../../../domain/auth/AuthTokens";

export class GetSessionUseCase {
  constructor({ storagePort }) {
    this.storagePort = storagePort;
  }

  execute() {
    const raw = this.storagePort.getItem(AUTH_STORAGE_KEYS.tokens);
    if (!raw) {
      return null;
    }
    try {
      const parsed = JSON.parse(raw);
      return AuthTokens.fromJSON(parsed);
    } catch (error) {
      this.storagePort.removeItem(AUTH_STORAGE_KEYS.tokens);
      return null;
    }
  }
}
