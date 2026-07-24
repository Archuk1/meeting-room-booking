import { api } from "@/lib/axios";
import type { LoginFormValues } from "@/validations/login.schema";
import type { RegisterFormValues } from "@/validations/register.schema";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export async function login(values: LoginFormValues): Promise<AuthUser> {
  const { data } = await api.post<{ user: AuthUser }>("/auth/login", values);
  return data.user;
}

export async function register(values: RegisterFormValues): Promise<AuthUser> {
  const { data } = await api.post<{ user: AuthUser }>("/auth/register", values);
  return data.user;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function me(): Promise<AuthUser> {
  const { data } = await api.get<{ user: AuthUser }>("/auth/me");
  return data.user;
}
