export const minGithubTokenLength = 10;

export function normalizeGithubToken(value: string | undefined | null): string | undefined {
  if (value == null) {
    return undefined;
  }
  const token = value.trim();
  if (token.length < minGithubTokenLength) {
    return undefined;
  }
  return token;
}
