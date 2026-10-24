import type { User } from "@/entities/user/model/types";
import {
  ApiError,
  apiRequest,
  clearSession,
  readSessionEmail,
  readToken,
  saveSession,
} from "@/shared/api/http";
import type { LoginPayload, LoginResponse, UpdateProfilePayload } from "./types";

function sessionUser(): User {
  return {
    id: "session",
    name: "",
    email: readSessionEmail(),
  };
}

interface LoginApiResponse {
  token?: string;
  error?: string;
}

export const authApi = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const data = await apiRequest<LoginApiResponse>("/login", {
      method: "POST",
      body: payload,
      auth: false,
    });

    const token = data.token?.trim();
    if (!token) {
      throw new ApiError(data.error?.trim() || "Не удалось войти", 400);
    }

    saveSession(token, payload.email.trim());
    const user = sessionUser();

    return {
      user,
      tokens: {
        accessToken: token,
        refreshToken: "",
      },
    };
  },

  async logout() {
    clearSession();
    return { ok: true as const };
  },

  async me(): Promise<{ user: User }> {
    if (!readToken()) throw new ApiError("Нужно войти в аккаунт", 401);
    return { user: sessionUser() };
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<{ user: User }> {
    void payload;
    throw new ApiError("Изменение профиля пока недоступно", 501);
  },
};

export { ApiError };
