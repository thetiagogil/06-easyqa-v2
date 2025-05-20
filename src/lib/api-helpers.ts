import { NextResponse } from "next/server";

export function jsonResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function notFound(message = "Not Found") {
  return jsonResponse({ error: message }, 404);
}

export function methodNotAllowed() {
  return jsonResponse({ error: "Method Not Allowed" }, 405);
}

export function handleError(error: unknown, fallbackMessage = "Server Error") {
  console.error(error);
  const message = error instanceof Error ? error.message : fallbackMessage;
  return jsonResponse({ error: message }, 500);
}
