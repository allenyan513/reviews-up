import { api } from '@/lib/api-client';
import { createContext, useContext, useState } from 'react';
import {
  ShowcaseConfig,
  ShowcaseEntity,
} from '@repo/api/showcases/entities/showcase.entity';
import { PaginateResponse } from '@repo/api/common/paginate';
import toast from 'react-hot-toast';
import { Showcase } from '@repo/database/generated/client/client';
import { SortBy } from '@/types/sortby';

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

  // const updateSortBy = (sortBy: SortBy) => {
  //   if (sortBy == SortBy.newest) {
  //     // showcase.reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  //     const newItems = showcases?.items?.sort(
  //       (a, b) =>
  //         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  //     );
  //     if (newItems) {
  //       setShowcases({
  //         ...showcases,
  //         items: newItems,
  //       });
  //     }
  //   } else if (sortBy == SortBy.oldest) {
  //     // showcase.reviews.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  //     const newItems = showcases?.items?.sort(
  //       (a, b) =>
  //         new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  //     );
  //     if (newItems) {
  //       setShowcases({
  //         ...showcases,
  //         items: newItems,
  //       });
  //     }
  //   }
  // };

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
