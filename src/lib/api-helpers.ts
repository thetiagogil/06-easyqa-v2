import { NextResponse } from "next/server";

type JsonResponseInit = {
  status?: number;
  headers?: HeadersInit;
};

export function jsonResponse<T>(
  data: T,
  { status = 200, headers }: JsonResponseInit = {}
) {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
}

export function badRequest(message = "Bad Request") {
  return jsonResponse({ error: message }, { status: 400 });
}

export function notFound(message = "Not Found") {
  return jsonResponse({ error: message }, { status: 404 });
}

export function methodNotAllowed() {
  return jsonResponse({ error: "Method Not Allowed" }, { status: 405 });
}

export function handleError(
  error: unknown,
  fallbackMessage = "Server Error",
  options: { log?: boolean } = { log: true }
) {
  if (options.log) console.error(error);

  const message = error instanceof Error ? error.message : fallbackMessage;

  return jsonResponse({ error: message }, { status: 500 });
}
