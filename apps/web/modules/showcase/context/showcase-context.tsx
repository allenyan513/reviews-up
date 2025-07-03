import { api } from '@/lib/api-client';
import { createContext, useContext, useState } from 'react';
import { ShowcaseConfig, ShowcaseEntity } from '@repo/api/showcases';
import { PaginateResponse } from '@repo/api/common';
import toast from 'react-hot-toast';
import { Showcase } from '@repo/database/generated/client/client';

const ShowcaseContext = createContext<{
  showcase: ShowcaseEntity | undefined;
  setShowcase: (showcase: ShowcaseEntity) => void;
  showcases: PaginateResponse<Showcase> | undefined;
  setShowcases: (showcases: PaginateResponse<Showcase>) => void;
  showcaseConfig: ShowcaseConfig | undefined;
  setShowcaseConfig: (config: ShowcaseConfig) => void;
  getShowcase: (showcaseId: string) => void;
  getShowcases: (workspaceId: string) => void;
  saveChange: () => Promise<void>;
  deleteShowcase: (showcaseId: string) => Promise<void>;
  createShowcase: (workspaceId: string, workspaceName: string) => Promise<void>;
} | null>(null);

export function ShowcaseProvider(props: { children: React.ReactNode }) {
  const [showcases, setShowcases] = useState<PaginateResponse<Showcase>>();
  const [showcase, setShowcase] = useState<ShowcaseEntity>();
  const [showcaseConfig, setShowcaseConfig] = useState<ShowcaseConfig>();

  const getShowcase = (showcaseId: string) => {
    api.showcase
      .getShowcase(showcaseId)
      .then((response) => {
        setShowcase(response);
        setShowcaseConfig(response.config as ShowcaseConfig);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  const getShowcases = (workspaceId: string) => {
    api.showcase.getShowcases(workspaceId).then((response) => {
      setShowcases(response);
    });
  };

  const deleteShowcase = async (showcaseId: string) => {
    if (!showcaseId) return;
    try {
      await api.showcase.deleteShowcase(showcaseId);
      await getShowcases(showcase?.workspaceId || '');
      toast.success('Showcase deleted successfully');
    } catch (error) {
      toast.error('Failed to delete showcase');
    }
  };

  const createShowcase = async (workspaceId: string, workspaceName: string) => {
    if (!workspaceId || !workspaceName) {
      toast.error('Please select a workspace first.');
      return;
    }
    try {
      await api.showcase.createShowcase({
        workspaceId: workspaceId,
        name: workspaceName,
      });
      await getShowcases(workspaceId);
      toast.success('Showcase created successfully');
    } catch (error) {
      toast.error('Failed to create showcase');
    }
  };

  const saveChange = async () => {
    if (!showcase) return;
    try {
      await api.showcase.updateShowcase(showcase.id, {
        config: showcaseConfig,
      });
      toast.success('Form configuration updated successfully');
    } catch (error) {
      toast.error('Failed to update form configuration');
    }
  };

  return (
    <ShowcaseContext.Provider
      value={{
        showcase: showcase,
        setShowcase: setShowcase,
        showcases: showcases,
        setShowcases: setShowcases,

        showcaseConfig: showcaseConfig,
        setShowcaseConfig: setShowcaseConfig,

        getShowcase: getShowcase,
        getShowcases: getShowcases,
        saveChange: saveChange,

        deleteShowcase: deleteShowcase,
        createShowcase: createShowcase,
      }}
    >
      {props.children}
    </ShowcaseContext.Provider>
  );
}

export function useShowcaseContext() {
  const context = useContext(ShowcaseContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
