import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren
} from "react";
import {
  createBrowserAuthClient,
  type BrowserAuthClient,
  type PresenterSession,
  type PresenterUser
} from "@/lib/supabase/client";

export type AuthStatus =
  | "loading"
  | "anonymous"
  | "authenticating"
  | "authenticated"
  | "expired"
  | "error";

type AuthContextValue = {
  user: PresenterUser | null;
  session: PresenterSession | null;
  status: AuthStatus;
  error: string | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = PropsWithChildren & {
  authClient?: BrowserAuthClient;
  initialSession?: PresenterSession | null;
  hydrateSession?: boolean;
};

export function AuthProvider({ children, authClient, initialSession = null, hydrateSession = true }: AuthProviderProps) {
  const [client] = useState<BrowserAuthClient>(() => authClient ?? createBrowserAuthClient());
  const [session, setSession] = useState<PresenterSession | null>(initialSession);
  const [status, setStatus] = useState<AuthStatus>(initialSession ? "authenticated" : hydrateSession ? "loading" : "anonymous");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (hydrateSession) {
      void client.getSession().then((nextSession) => {
        if (!isMounted) {
          return;
        }

        setSession(nextSession);
        setStatus(nextSession ? "authenticated" : "anonymous");
      }).catch((reason: unknown) => {
        if (!isMounted) {
          return;
        }

        setStatus("error");
        setError(reason instanceof Error ? reason.message : "Unable to restore session.");
      });
    }

    const unsubscribe = client.onAuthStateChange((nextSession) => {
      setSession(nextSession);
      setStatus(nextSession ? "authenticated" : "anonymous");
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [client, hydrateSession]);

  const signIn = useCallback(async (email: string, password: string) => {
    setStatus("authenticating");
    setError(null);

    try {
      const nextSession = await client.signIn(email, password);
      setSession(nextSession);
      setStatus("authenticated");
    } catch (reason: unknown) {
      setSession(null);
      setStatus("error");
      setError(reason instanceof Error ? reason.message : "Unable to sign in.");
      throw reason;
    }
  }, [client]);

  const signOut = useCallback(async () => {
    await client.signOut();
    setSession(null);
    setStatus("anonymous");
  }, [client]);

  const value = useMemo<AuthContextValue>(() => ({
    user: session?.user ?? null,
    session,
    status,
    error,
    isAuthenticated: status === "authenticated",
    signIn,
    signOut
  }), [error, session, signIn, signOut, status]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }

  return value;
}