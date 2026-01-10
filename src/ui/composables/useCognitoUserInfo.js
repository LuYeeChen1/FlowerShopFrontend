import { computed } from "vue";

const decodeJwtPayload = (token) => {
  if (!token) {
    return null;
  }
  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }
  const normalized = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  try {
    return JSON.parse(atob(padded));
  } catch (error) {
    return null;
  }
};

export const useCognitoUserInfo = (sessionRef) => {
  const payload = computed(() => {
    if (!sessionRef?.value?.idToken) {
      return null;
    }
    return decodeJwtPayload(sessionRef.value.idToken);
  });

  const email = computed(() => {
    return payload.value?.email || payload.value?.["cognito:username"] || "";
  });

  const groups = computed(() => {
    const rawGroups = payload.value?.["cognito:groups"];
    if (Array.isArray(rawGroups)) {
      return rawGroups;
    }
    if (rawGroups) {
      return [rawGroups];
    }
    return [];
  });

  return {
    email,
    groups,
    payload,
  };
};
