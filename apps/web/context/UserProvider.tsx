import { api } from '@/lib/api-client';
import { createContext, useContext, useEffect, useState } from 'react';
import { Workspace } from '@repo/api/workspaces/entities/workspace.entity';
import { User } from '@repo/api/users/entities/user.entity';
import useLocalStorageState from 'use-local-storage-state';
import { redirect } from 'next/navigation';

interface UserContextProps {
  user: User | null;
  defaultWorkspace: Workspace | null | undefined;
  switchDefaultWorkspace: (workspace: Workspace | null) => void;
  getSession: () => Promise<User>;
  googleSignIn: () => void;
  githubSignIn: () => void;
  sendMagicLink: (email: string) => Promise<void>;
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
  const switchDefaultWorkspace = (workspace: Workspace | null) => {
    if (!workspace) {
      console.error('Cannot switch to null workspace');
      return;
    }
    console.log('Switching default workspace to:', workspace);
    setDefaultWorkspace(workspace);
  };

  const googleSignIn = () => {
    redirect(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`);
  };

  const githubSignIn = () => {
    redirect(`${process.env.NEXT_PUBLIC_API_URL}/auth/github`);
  };
  const sendMagicLink = async (email: string) => {
    try {
      await api.auth.sendMagicLink(email);
    } catch (error) {
      throw error;
    }
  };

  const signOut = () => {
    localStorage.removeItem('access_token');
    redirect('/auth/signin');
  };
  const getSession = async (): Promise<User> => {
    const user = await api.auth.getSession();
    if (!user) {
      return redirect('/auth/signin');
    }
    setUser(user);
    return user;
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
        switchDefaultWorkspace,
        googleSignIn,
        githubSignIn,
        sendMagicLink,
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
