import type { User } from "@/entities/user/model/types";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  password?: string;
  currentPassword?: string;
}
