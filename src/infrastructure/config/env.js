const requireEnv = (key) => {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const env = {
  cognitoDomain: requireEnv("VITE_COGNITO_DOMAIN"),
  cognitoClientId: requireEnv("VITE_COGNITO_CLIENT_ID"),
  cognitoRedirectUri: requireEnv("VITE_COGNITO_REDIRECT_URI"),
  cognitoLogoutRedirectUri: requireEnv("VITE_COGNITO_LOGOUT_REDIRECT_URI"),
};
