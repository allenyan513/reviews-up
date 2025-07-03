import { api } from '@/lib/api-client';
import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  CampaignEntity,
  CreateCampaignDto,
  createCampaignSchema,
} from '@repo/api/campaign';
import { useUserContext } from '@/context/UserProvider';
import { FormEntity } from '@repo/api/forms';

const CampaignContext = createContext<{
  forms: FormEntity[] | undefined;
  findAll: (pageIndex: number, pageSize: number) => Promise<any>;
  findOne: (id: string) => Promise<CampaignEntity | null>;
  // update: () => Promise<void>;
  // deleteOne: (id: string) => Promise<void>;
  create: (dto: CreateCampaignDto) => Promise<void>;

  submitForm: CreateCampaignDto | undefined;
  setSubmitForm: React.Dispatch<
    React.SetStateAction<CreateCampaignDto | undefined>
  >;

  sendCampaign: (isTest: boolean) => Promise<void>;
} | null>(null);

export function CampaignProvider(props: { children: React.ReactNode }) {
  const { defaultWorkspace, user } = useUserContext();
  const [forms, setForms] = useState<FormEntity[]>();

  const [submitForm, setSubmitForm] = useState<CreateCampaignDto>();

  const findAllFormsByWorkspaceId = (workspaceId: string) => {
    api.form
      .getForms(workspaceId)
      .then((response) => {
        setForms(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const findAll = async (pageIndex: number, pageSize: number) => {
    if (!defaultWorkspace) {
      return null;
    }
    const res = await api.campaign.findAll({
      workspaceId: defaultWorkspace?.id || '',
      page: pageIndex + 1,
      pageSize: pageSize,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    return {
      data: res.items,
      pageCount: res.meta.total,
      totalRowCount: res.meta.total,
    };
  };

  const findOne = async (id: string) => {
    try {
      return await api.campaign.findOne(id);
    } catch (error) {
      console.error('Failed to find campaign:', error);
      return null;
    }
  };

  // const update = async () => {
  //   if (!campaign || !campaign.id) {
  //     toast.error('No campaign selected');
  //     return;
  //   }
  //   try {
  //     await api.campaign.update(campaign.id, {});
  //     toast.success('Campaign updated successfully');
  //   } catch (error) {
  //     toast.error('Failed to update campaign');
  //   }
  // };
  // const deleteOne = async (id: string) => {
  //   if (!id) return;
  //   try {
  //     await api.campaign.deleteOne(id);
  //     // setCampaigns((prevCampaigns) => prevCampaigns?.filter((c) => c.id !== id));
  //     toast.success('Campaign deleted successfully');
  //   } catch (error) {
  //     toast.error('Failed to delete campaign');
  //   }
  // }
  const create = async (dto: CreateCampaignDto) => {
    if (!dto) return;
    try {
      const response = await api.campaign.create(dto);
      // setCampaigns((prevCampaigns) => [...(prevCampaigns || []), response]);
      toast.success('Campaign created successfully');
    } catch (error) {
      toast.error('Failed to create campaign');
    }
  };

  const sendCampaign = async (isTest: boolean) => {
    if (!submitForm || !user) {
      toast.error(
        `Please fill out the form before sending a ${isTest ? 'test' : ''} campaign`,
      );
      return;
    }
    try {
      const validatedDto = createCampaignSchema.parse({
        ...submitForm,
        isTest: isTest,
      });
      await api.campaign.create(validatedDto);
      toast.success(`Campaign ${isTest ? 'test ' : ''}sent successfully`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send campaign');
    }
  };

  useEffect(() => {
    if (!user || !defaultWorkspace) {
      return;
    }
    // findAll(0, 10)
    findAllFormsByWorkspaceId(defaultWorkspace.id);
  }, [user, defaultWorkspace]);

  useEffect(() => {
    if (!user || !defaultWorkspace || !forms) {
      return;
    }
    setSubmitForm({
      workspaceId: defaultWorkspace.id || '',
      formId: forms?.[0]?.id || '',
      formShortId: forms?.[0]?.shortId || '',
      name: 'New Campaign',
      fromName: `${user.name || ''}`,
      fromEmail: 'reply@mail.reviewsup.io',
      toEmails: [],
      subject: 'We would love to hear your feedback. {{name}}',
      content: `Hi {{name}},

Your feedback is incredibly important in helping us improve and provide the best possible experience.
Would you kindly take a moment to click the link below and share your thoughts? Your insights mean the world to us!

Thank you so much for your support!

Cheers,  
${user.name}  
      `,
      isTest: false,
      buttonText: 'Leave a review',
    });
  }, [user, defaultWorkspace, forms]);

  return (
    <CampaignContext.Provider
      value={{
        forms,
        findAll,
        findOne,
        // update,
        // deleteOne,
        create,
        submitForm,
        setSubmitForm,
        sendCampaign,
      }}
    >
      {props.children}
    </CampaignContext.Provider>
  );
}

export function useCampaignContext() {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
