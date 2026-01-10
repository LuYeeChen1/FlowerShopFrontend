export class AuthPort {
  buildAuthorizationUrl() {
    throw new Error("AuthPort.buildAuthorizationUrl not implemented");
  }

  exchangeCodeForTokens() {
    throw new Error("AuthPort.exchangeCodeForTokens not implemented");
  }

  buildLogoutUrl() {
    throw new Error("AuthPort.buildLogoutUrl not implemented");
  }
}
