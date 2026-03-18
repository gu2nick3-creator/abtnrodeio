import type { ArenaData, AuthSession } from "@/data/mockData";

const jsonHeaders = { "Content-Type": "application/json" };

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(path, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error || "Erro ao processar a requisição");
  }
  return data as T;
}

export const api = {
  bootstrap: () => request<ArenaData & { evaluations: ArenaData["evaluations"] }>("/api/bootstrap"),
  loginAdmin: (email: string, senha: string) => request<{ token: string; admin: { id: number; nome: string; email: string } }>("/api/login", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ email, senha }),
  }),
  loginTropeiro: (username: string, senha: string) => request<{ token: string; user: { id: number; username: string; tropeiro_id: number } }>("/api/tropeiro-login", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ username, senha }),
  }),
  verifySession: (session: AuthSession) => request("/api/me", {
    headers: { Authorization: `Bearer ${session.token}` },
  }),
  upload: (session: AuthSession, file: string, tipo: "image" | "video", folder?: string) => request<{ url: string; public_id?: string; formato?: string; resource_type?: string }>("/api/upload", {
    method: "POST",
    headers: { ...jsonHeaders, Authorization: `Bearer ${session.token}` },
    body: JSON.stringify({ file, tipo, folder }),
  }),
  create: (session: AuthSession, path: string, body: unknown) => request(`/${path}`, {
    method: "POST",
    headers: { ...jsonHeaders, Authorization: `Bearer ${session.token}` },
    body: JSON.stringify(body),
  }),
  update: (session: AuthSession, path: string, id: number, body: unknown) => request(`/${path}?id=${id}`, {
    method: "PUT",
    headers: { ...jsonHeaders, Authorization: `Bearer ${session.token}` },
    body: JSON.stringify(body),
  }),
  remove: (session: AuthSession, path: string, id: number) => request(`/${path}?id=${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${session.token}` },
  }),
  updateOwnProfile: (session: AuthSession, body: unknown) => request("/api/tropeiro-profile", {
    method: "PUT",
    headers: { ...jsonHeaders, Authorization: `Bearer ${session.token}` },
    body: JSON.stringify(body),
  }),
};
