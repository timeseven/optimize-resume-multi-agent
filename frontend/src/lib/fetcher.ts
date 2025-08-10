const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function fetcher<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const body = options?.body;
  const isFormData = body instanceof FormData;
  const isURLEncoded = body instanceof URLSearchParams;

  const res = await fetch(`${BASE_URL}${url}`, {
    credentials: "include",
    headers: {
      ...(isFormData || isURLEncoded
        ? {}
        : { "Content-Type": "application/json" }),
      ...(isURLEncoded
        ? { "Content-Type": "application/x-www-form-urlencoded" }
        : {}),
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    const message = errorBody.message || "Unknown error";
    throw new Error(
      typeof message === "string" ? message : JSON.stringify(message)
    );
  }

  return res.json();
}
