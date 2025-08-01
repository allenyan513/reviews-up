import { api } from '@/lib/api-client';
import { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { FormEntity, FormConfig } from '@reviewsup/api/forms';
import { WallOfLoveEntity } from '@reviewsup/api/walloflove';

const WallOfLoveContext = createContext<{
  wallOfLove: WallOfLoveEntity | undefined;
  setWallOfLove: (wallOfLove: any) => void;
  updateConfig: () => Promise<void>;
} | null>(null);

export function WallOfLoveProvider(props: { children: React.ReactNode }) {
  const [wallOfLove, setWallOfLove] = useState<WallOfLoveEntity | undefined>();
  const updateConfig = async () => {
    if (!wallOfLove || !wallOfLove.id || !wallOfLove.config) {
      return;
    }
    try {
      await api.wallOfLove.updateOne(wallOfLove.id, {
        config: wallOfLove.config,
      });
      toast.success('Form configuration updated successfully');
    } catch (error) {
      toast.error('Failed to update form configuration');
    }
  };

  return (
    <WallOfLoveContext.Provider
      value={{
        wallOfLove,
        setWallOfLove,
        updateConfig,
      }}
    >
      {props.children}
    </WallOfLoveContext.Provider>
  );
}

export function useWallOfLoveContext() {
  const context = useContext(WallOfLoveContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
