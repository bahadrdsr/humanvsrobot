import { createClient, type Session, type SupabaseClient } from "@supabase/supabase-js";
import { authEnv, isSupabaseConfigured } from "@/lib/supabase/env";

export type PresenterUser = {
  id: string;
  email: string;
};

export type PresenterSession = {
  user: PresenterUser;
  accessToken?: string;
};

export type BrowserAuthClient = {
  getSession: () => Promise<PresenterSession | null>;
  signIn: (email: string, password: string) => Promise<PresenterSession>;
  signOut: () => Promise<void>;
  onAuthStateChange: (listener: (session: PresenterSession | null) => void) => () => void;
};

const MOCK_STORAGE_KEY = "humanvsrobot.presenter";
const mockListeners = new Set<(session: PresenterSession | null) => void>();

function normalizeSession(session: Session | null): PresenterSession | null {
  if (!session?.user.email) {
    return null;
  }

  return {
    user: {
      id: session.user.id,
      email: session.user.email
    },
    accessToken: session.access_token
  };
}

function createMockAuthClient(): BrowserAuthClient {
  const readMockSession = () => {
    if (typeof window === "undefined") {
      return null;
    }

    const raw = window.localStorage.getItem(MOCK_STORAGE_KEY);
    return raw ? JSON.parse(raw) as PresenterSession : null;
  };

  const emit = (session: PresenterSession | null) => {
    mockListeners.forEach((listener) => listener(session));
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", (event) => {
      if (event.key === MOCK_STORAGE_KEY) {
        emit(readMockSession());
      }
    });
  }

  return {
    async getSession() {
      return readMockSession();
    },
    async signIn(email, password) {
      if (!email.trim() || !password.trim()) {
        throw new Error("Enter both email and password to begin the demo.");
      }

      const session: PresenterSession = {
        user: {
          id: `mock-${email.trim().toLowerCase()}`,
          email: email.trim().toLowerCase()
        },
        accessToken: "mock-demo-token"
      };

      window.localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(session));
      emit(session);
      return session;
    },
    async signOut() {
      window.localStorage.removeItem(MOCK_STORAGE_KEY);
      emit(null);
    },
    onAuthStateChange(listener) {
      mockListeners.add(listener);
      return () => {
        mockListeners.delete(listener);
      };
    }
  };
}

function createSupabaseAuthClient(supabase: SupabaseClient): BrowserAuthClient {
  return {
    async getSession() {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        throw error;
      }
      return normalizeSession(data.session);
    },
    async signIn(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        throw error;
      }

      const session = normalizeSession(data.session);
      if (!session) {
        throw new Error("A presenter session could not be created.");
      }

      return session;
    },
    async signOut() {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    },
    onAuthStateChange(listener) {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        listener(normalizeSession(session));
      });

      return () => {
        data.subscription.unsubscribe();
      };
    }
  };
}

let singletonClient: BrowserAuthClient | null = null;

export function createBrowserAuthClient(): BrowserAuthClient {
  if (singletonClient) {
    return singletonClient;
  }

  singletonClient = isSupabaseConfigured()
    ? createSupabaseAuthClient(createClient(authEnv.supabaseUrl, authEnv.supabaseAnonKey))
    : createMockAuthClient();

  return singletonClient;
}