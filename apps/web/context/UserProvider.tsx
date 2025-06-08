import { api } from '@/lib/apiClient';
import { useSession } from 'next-auth/react';
import { createContext, useContext, useEffect, useState } from 'react';
import { Workspace } from '@repo/api/workspaces/entities/workspace.entity';
import { User } from '@repo/api/users/entities/user.entity';

interface UserContextProps {
  user: User | null;
  defaultWorkspace: Workspace | null | undefined;
}

const UserContext = createContext<UserContextProps | null>(null);

export function UserProvider(props: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [defaultWorkspace, setDefaultWorkspace] = useState<
    Workspace | null | undefined
  >(null);

  useEffect(() => {
    if (!session) return;
    api
      .getUserProfile({
        session: session,
      })
      .then((user) => {
        setUser(user);
        setDefaultWorkspace(user.Workspace ? user.Workspace[0] : null);
      });
  }, [session]);

  return (
    <UserContext.Provider
      value={{
        user,
        defaultWorkspace,
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
