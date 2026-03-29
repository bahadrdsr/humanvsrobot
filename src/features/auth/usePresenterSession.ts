import { useAuthContext } from "@/app/providers/AuthProvider";

export function usePresenterSession() {
  return useAuthContext();
}