import type { User } from "@/entities/user/model/types";
import {
  ApiError,
  apiRequest,
  clearSession,
  readSessionEmail,
  readToken,
  saveSession,
} from "@/shared/api/http";
import type { ChangePasswordPayload, LoginPayload, LoginResponse, UpdateProfilePayload } from "./types";

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

  async changePassword(payload: ChangePasswordPayload): Promise<void> {
    const oldPassword = payload.oldPassword;
    const newPassword = payload.newPassword.trim();
    if (!oldPassword || !newPassword) {
      throw new ApiError("Нужны текущий и новый пароль", 400);
    }

    await apiRequest<Record<string, unknown>>("/user/change-password", {
      method: "POST",
      body: {
        old_password: oldPassword,
        new_password: newPassword,
      },
    });
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<{ user: User }> {
    if (payload.password) {
      await this.changePassword({
        oldPassword: payload.currentPassword ?? "",
        newPassword: payload.password,
      });
      return { user: sessionUser() };
    }

    throw new ApiError("Сервер сохраняет только смену пароля", 400);
  },
};

export { ApiError };
