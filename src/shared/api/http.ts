import { withBasePath } from "@/shared/lib/base-path";

const TOKEN_KEY = "termcat:token";
const EMAIL_KEY = "termcat:email";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function readToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function readSessionEmail() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(EMAIL_KEY) ?? "";
}

export function saveSession(token: string, email: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(EMAIL_KEY, email);
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(EMAIL_KEY);
}

function apiBase() {
  if (process.env.NEXT_PUBLIC_USE_API_PROXY === "1") {
    return withBasePath("/backend");
  }

  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (!base) throw new ApiError("Не задан NEXT_PUBLIC_API_URL", 500);
  return base;
}

interface ApiRequestOptions {
  method?: string;
  body?: unknown;
  auth?: boolean;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const headers = new Headers();
  if (options.body !== undefined) headers.set("Content-Type", "application/json");

  if (options.auth !== false) {
    const token = readToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${apiBase()}${path}`, {
      method: options.method ?? "GET",
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch {
    throw new ApiError("Нет соединения с сервером", 0);
  }

  const payload = (await response.json().catch(() => null)) as { error?: string } | null;

  if (!response.ok) {
    if (response.status === 401 && options.auth !== false) clearSession();
    const message = payload?.error?.trim() || fallbackMessage(response.status);
    throw new ApiError(message, response.status);
  }

  return (payload ?? {}) as T;
}

function fallbackMessage(status: number) {
  if (status === 401) return "Нужно войти в аккаунт";
  if (status === 400) return "Некорректный запрос";
  return "Ошибка запроса";
}
