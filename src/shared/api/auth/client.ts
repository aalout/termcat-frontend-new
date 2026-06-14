import { DemoBackendError, demoBackend } from "@/shared/lib/demo-backend";
import type { LoginPayload, LoginResponse, RefreshResponse, UpdateProfilePayload } from "./types";
import type { User } from "@/entities/user/model/types";

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function wrap<T>(fn: () => T): Promise<T> {
  return Promise.resolve().then(() => {
    try {
      return fn();
    } catch (error) {
      if (error instanceof DemoBackendError) {
        throw new ApiError(error.message, error.status);
      }
      throw error;
    }
  });
}

export async function apiFetch<T>(_path: string, _init?: RequestInit): Promise<T> {
  throw new ApiError("Direct apiFetch is not supported in demo mode", 501);
}

export const authApi = {
  login(payload: LoginPayload) {
    return wrap<LoginResponse>(() => demoBackend.login(payload));
  },

  logout() {
    return wrap<{ ok: true }>(() => demoBackend.logout());
  },

  me() {
    return wrap<{ user: User }>(() => demoBackend.me());
  },

  refresh() {
    return wrap<RefreshResponse>(() => demoBackend.refresh());
  },

  updateProfile(payload: UpdateProfilePayload) {
    return wrap<{ user: User }>(() => demoBackend.updateProfile(payload));
  },
};

export { ApiError };
