import {api} from '@/lib/api-client';
import {createContext, useContext, useEffect, useState} from 'react';
import {Workspace} from '@repo/api/workspaces/entities/workspace.entity';
import {User} from '@repo/api/users/index';
import useLocalStorageState from 'use-local-storage-state';
import {redirect, useRouter} from 'next/navigation';

interface UserContextProps {
  user: User | null;
  defaultWorkspace: Workspace | null | undefined;
  setDefaultWorkspace: (workspace: Workspace | null) => void;
  switchDefaultWorkspace: (workspace: Workspace | null) => void;
  getSession: () => void;
  googleSignIn: (redirect?: string) => void;
  githubSignIn: (redirect?: string) => void;
  twitterSignIn: (redirect?: string) => void;
  sendMagicLink: (email: string, redirect?: string) => Promise<void>;
  signIn: (callbackUrl?: string) => void;
  signOut: () => void;
}

const UserContext = createContext<UserContextProps | null>(null);

export function UserProvider(props: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [defaultWorkspace, setDefaultWorkspace] = useLocalStorageState<
    Workspace | null | undefined
  >(`${user?.id}_workspace`, {
    defaultValue: null,
  });
  const router = useRouter();

  const switchDefaultWorkspace = (workspace: Workspace | null) => {
    if (!workspace) {
      console.error('Cannot switch to null workspace');
      return;
    }
    console.log('Switching default workspace to:', workspace);
    setDefaultWorkspace(workspace);
  };

  const signIn = (redirectUrl?: string) => {
    if (!user) {
      const defaultCallbackUrl = typeof window !== 'undefined' ? window.location.href : redirectUrl || '/';
      router.push('/auth/signin?redirect=' + encodeURIComponent(defaultCallbackUrl));
    }
  }

  const googleSignIn = (redirectUrl?: string) => {
    redirect(`${process.env.NEXT_PUBLIC_API_URL}/auth/google?redirect=${encodeURIComponent(redirectUrl || '')}`);
  };

  const githubSignIn = (redirectUrl?: string) => {
    redirect(`${process.env.NEXT_PUBLIC_API_URL}/auth/github?redirect=${encodeURIComponent(redirectUrl || '')}`);
  };
  const twitterSignIn = (redirectUrl?: string) => {
    redirect(`${process.env.NEXT_PUBLIC_API_URL}/auth/twitter?redirect=${encodeURIComponent(redirectUrl || '')}`);
  }

  const sendMagicLink = async (
    email: string,
    redirectUrl?: string
  ) => {
    try {
      await api.auth.sendMagicLink(email, redirectUrl);
    } catch (error) {
      throw error;
    }
  };

  const signOut = () => {
    localStorage.removeItem('access_token');
    redirect('/auth/signin');
  };

  const getSession = async (): Promise<void> => {
    try {
      const user = await api.auth.getSession();
      if (user) {
        setUser(user);
      }
    } catch (error) {
      // console.error('Failed to get session:', error);
    }
  };

  useEffect(() => {
    getSession();
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }
    if (!defaultWorkspace) {
      const firstWorkspace = user.Workspace ? user.Workspace[0] : null;
      setDefaultWorkspace(firstWorkspace);
    } else {
      console.log('Default workspace already set:', defaultWorkspace);
    }
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        defaultWorkspace,
        setDefaultWorkspace,
        switchDefaultWorkspace,
        googleSignIn,
        githubSignIn,
        twitterSignIn,
        sendMagicLink,
        signIn,
        signOut,
        getSession,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

interface UseSessionOptions {
  required?: boolean;
  onUnauthenticated?: () => void;
}

export function useSession(options: UseSessionOptions) {
  const {user} = useUserContext();

  useEffect(() => {
    if (!user && options.required) {
      if (options.onUnauthenticated) {
        options.onUnauthenticated();
      } else {
        console.warn('No onUnauthenticated handler provided, redirecting to signin');
      }
    }
  }, [user, options]);

  return {user};
}


interface UseServerSessionOptions {
  required?: boolean;
  onUnauthenticated?: () => void;
}

/**
 *  server-side session hook
 * @param options
 */
export function useServerSession(options: UseServerSessionOptions) {


}
