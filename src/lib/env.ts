type PublicEnv = {
  NEXT_PUBLIC_API_BASE_URL: string;
  NEXT_PUBLIC_APP_URL: string;
};

function resolveEnvValue({
  key,
  value,
  fallback,
}: {
  key: keyof PublicEnv;
  value: string | undefined;
  fallback: string;
}) {
  const normalizedValue = value?.trim();

  if (normalizedValue) {
    return normalizedValue;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      `Missing required environment variable: ${key}. Set it in your deploy environment before building.`,
    );
  }

  return fallback;
}

const apiBaseUrl = resolveEnvValue({
  key: "NEXT_PUBLIC_API_BASE_URL",
  value: process.env.NEXT_PUBLIC_API_BASE_URL,
  fallback: "http://localhost:4000",
});

const appUrl = resolveEnvValue({
  key: "NEXT_PUBLIC_APP_URL",
  value: process.env.NEXT_PUBLIC_APP_URL,
  fallback: "http://localhost:3000",
});

export const env: PublicEnv = {
  NEXT_PUBLIC_API_BASE_URL: apiBaseUrl,
  NEXT_PUBLIC_APP_URL: appUrl,
};
