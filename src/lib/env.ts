type PublicEnv = {
  NEXT_PUBLIC_API_BASE_URL: string;
  NEXT_PUBLIC_APP_URL: string;
};

function getEnvValue(key: keyof PublicEnv, fallback: string) {
  const value = process.env[key];

  if (!value) {
    return fallback;
  }

  return value;
}

export const env: PublicEnv = {
  NEXT_PUBLIC_API_BASE_URL: getEnvValue(
    "NEXT_PUBLIC_API_BASE_URL",
    "http://localhost:4000",
  ),
  NEXT_PUBLIC_APP_URL: getEnvValue(
    "NEXT_PUBLIC_APP_URL",
    "http://localhost:3000",
  ),
};
