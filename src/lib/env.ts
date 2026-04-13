type PublicEnv = {
  NEXT_PUBLIC_API_BASE_URL: string;
  NEXT_PUBLIC_APP_URL: string;
};

function getEnvValue(key: keyof PublicEnv, fallback: string) {
  const value = process.env[key]?.trim();

  if (value) {
    return value;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      `Missing required environment variable: ${key}. Set it in your deploy environment before building.`,
    );
  }

  if (!fallback) {
    return fallback;
  }

  return fallback;
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
