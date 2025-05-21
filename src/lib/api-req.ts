export function extractParamsFromUrl(
  req: Request | { url: string },
  keys: string[]
): Record<string, string | null> {
  const results: Record<string, string | null> = {};
  try {
    const url = new URL(req.url);
    const segments = url.pathname.split("/").filter(Boolean);

    for (const key of keys) {
      const index = segments.indexOf(key);
      results[key] =
        index !== -1 && segments.length > index + 1
          ? segments[index + 1]
          : null;
    }

    return results;
  } catch (error) {
    console.error("Invalid URL:", error);
    for (const key of keys) results[key] = null;
    return results;
  }
}
