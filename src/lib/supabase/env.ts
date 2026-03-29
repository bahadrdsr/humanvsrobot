export type AuthProviderKind = "supabase" | "mock";

const rawProvider = import.meta.env.VITE_AUTH_PROVIDER?.toLowerCase();

export const authEnv = {
  provider: (rawProvider === "supabase" ? "supabase" : "mock") as AuthProviderKind,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? "",
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? ""
};

export function isSupabaseConfigured() {
  return Boolean(authEnv.supabaseUrl && authEnv.supabaseAnonKey && authEnv.provider === "supabase");
}