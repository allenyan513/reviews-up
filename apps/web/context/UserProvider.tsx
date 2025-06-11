import { api } from '@/lib/apiClient';
import { useSession } from 'next-auth/react';
import { createContext, useContext, useEffect, useState } from 'react';
import { Workspace } from '@repo/api/workspaces/entities/workspace.entity';
import { User } from '@repo/api/users/entities/user.entity';
import useLocalStorageState from 'use-local-storage-state';

interface UserContextProps {
  user: User | null;
  defaultWorkspace: Workspace | null | undefined;
  switchDefaultWorkspace: (workspace: Workspace | null) => void;
}

const UserContext = createContext<UserContextProps | null>(null);

export function UserProvider(props: { children: React.ReactNode }) {
  const { data: session } = useSession();
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

  useEffect(() => {
    if (!session) return;
    api
      .getUserProfile({
        session: session,
      })
      .then((user) => {
        setUser(user);
        if (!defaultWorkspace) {
          // If no default workspace is set, use the first workspace from the user
          const firstWorkspace = user.Workspace ? user.Workspace[0] : null;
          setDefaultWorkspace(firstWorkspace);
          console.log(
            'Setting default workspace to first workspace:',
            firstWorkspace,
          );
        } else {
          console.log('Default workspace already set:', defaultWorkspace);
        }
      });
  }, [session]);

  return (
    <UserContext.Provider
      value={{
        user,
        defaultWorkspace,
        switchDefaultWorkspace,
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
