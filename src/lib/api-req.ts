export function extractParamFromUrl(
  req: Request | { url: string }
): string | null {
  try {
    const url = new URL(req.url);
    const segments = url.pathname.split("/").filter(Boolean);
    return segments.at(-1) ?? null;
  } catch (error) {
    console.error("Invalid URL:", error);
    return null;
  }
}
