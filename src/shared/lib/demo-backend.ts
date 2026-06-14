import type { User } from "@/entities/user/model/types";
import type { AnalysisSession } from "@/entities/analysis/model/types";
import type { LoginPayload, UpdateProfilePayload } from "@/shared/api/auth/types";
import type {
  AnalyzePayload,
  AnalyzeResponse,
  HistoryItem,
} from "@/shared/api/analysis/client";
import type { LoginResponse, RefreshResponse } from "@/shared/api/auth/types";
import { analyzeText } from "@/shared/lib/analysis-core";

interface StoredUser extends User {
  password: string;
}

const DEMO_USER: StoredUser = {
  id: "1",
  name: "Алексей Иванов",
  email: "alexey@termcat.ru",
  password: "demo123",
};

const USERS = new Map<string, StoredUser>([[DEMO_USER.email, { ...DEMO_USER }]]);

const SESSION_KEY = "termcat:session";
const HISTORY_KEY = "termcat:history";

function toPublicUser(user: StoredUser): User {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...publicUser } = user;
  return publicUser;
}

function readSessionUser(): User | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as User;
    return getUserById(parsed.id);
  } catch {
    return null;
  }
}

function writeSessionUser(user: User | null) {
  if (typeof window === "undefined") return;

  if (!user) {
    window.localStorage.removeItem(SESSION_KEY);
    return;
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function readHistory(userId: string): AnalysisSession[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(`${HISTORY_KEY}:${userId}`);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as AnalysisSession[];
  } catch {
    return [];
  }
}

function writeHistory(userId: string, items: AnalysisSession[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(`${HISTORY_KEY}:${userId}`, JSON.stringify(items.slice(0, 20)));
}

function getUserById(id: string): User | null {
  for (const user of USERS.values()) {
    if (user.id === id) return toPublicUser(user);
  }
  return null;
}

function requireUser(): User {
  const user = readSessionUser();
  if (!user) throw new DemoBackendError("Unauthorized", 401);
  return user;
}

export class DemoBackendError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const demoBackend = {
  login(payload: LoginPayload): LoginResponse {
    const user = USERS.get(payload.email.toLowerCase());
    if (!user || user.password !== payload.password) {
      throw new DemoBackendError("Неверный email или пароль", 401);
    }

    const publicUser = toPublicUser(user);
    writeSessionUser(publicUser);
    return {
      user: publicUser,
      tokens: {
        accessToken: "demo-access",
        refreshToken: "demo-refresh",
      },
    };
  },

  logout(): { ok: true } {
    writeSessionUser(null);
    return { ok: true };
  },

  me(): { user: User } {
    return { user: requireUser() };
  },

  refresh(): RefreshResponse {
    requireUser();
    return { accessToken: "demo-access" };
  },

  updateProfile(payload: UpdateProfilePayload): { user: User } {
    const current = requireUser();
    const entry = [...USERS.entries()].find(([, user]) => user.id === current.id);
    if (!entry) throw new DemoBackendError("Unauthorized", 401);

    const [currentEmail, user] = entry;

    if (payload.password) {
      if (!payload.currentPassword || payload.currentPassword !== user.password) {
        throw new DemoBackendError("Неверный текущий пароль", 400);
      }
      user.password = payload.password;
    }

    if (payload.name) user.name = payload.name;

    if (payload.email && payload.email !== user.email) {
      if (USERS.has(payload.email.toLowerCase())) {
        throw new DemoBackendError("Email уже занят", 409);
      }
      USERS.delete(currentEmail);
      user.email = payload.email.toLowerCase();
      USERS.set(user.email, user);
    }

    const publicUser = toPublicUser(user);
    writeSessionUser(publicUser);
    return { user: publicUser };
  },

  analyze(payload: AnalyzePayload): AnalyzeResponse {
    const user = requireUser();
    if (!payload.text?.trim()) {
      throw new DemoBackendError("Текст обязателен", 400);
    }

    const session = analyzeText(
      payload.text.trim(),
      payload.sourceLang ?? "ru",
      payload.targetLang ?? "en"
    );

    const history = readHistory(user.id);
    writeHistory(user.id, [session, ...history]);

    return {
      id: session.id,
      title: session.title,
      sourceText: session.sourceText,
      translatedText: session.translatedText,
      sourceLang: session.sourceLang,
      targetLang: session.targetLang,
      terms: session.terms,
      wordCount: session.wordCount,
    };
  },

  history(): { items: HistoryItem[] } {
    const user = requireUser();
    const items = readHistory(user.id).map((item) => ({
      id: item.id,
      title: item.title,
      createdAt: item.createdAt,
      termCount: item.terms.length,
    }));

    return { items };
  },
};
