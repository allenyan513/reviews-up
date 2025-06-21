import {api} from '@/lib/api-client';
import {createContext, useContext, useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import {CampaignEntity, CreateCampaignDto, createCampaignSchema} from "@repo/api/campaign/index";
import {useUserContext} from "@/context/UserProvider";
import {FormEntity} from "@repo/api/forms/entities/form.entity";
import {ZodError} from "zod";

const CampaignContext = createContext<{
  forms: FormEntity[] | undefined;
  campaigns: CampaignEntity[] | undefined;
  campaign: CampaignEntity | undefined;
  findAll: (workspaceId: string) => void;
  findOne: (id: string) => void;
  update: () => Promise<void>;
  deleteOne: (id: string) => Promise<void>;
  create: (dto: CreateCampaignDto) => Promise<void>;

  submitForm: CreateCampaignDto | undefined;
  setSubmitForm: React.Dispatch<React.SetStateAction<CreateCampaignDto | undefined>>;

  sendCampaign: (isTest: boolean) => Promise<void>;
} | null>(null);

export function CampaignProvider(props: { children: React.ReactNode }) {
  const {defaultWorkspace, user} = useUserContext()
  const [campaigns, setCampaigns] = useState<CampaignEntity[]>();
  const [campaign, setCampaign] = useState<CampaignEntity>();
  const [forms, setForms] = useState<FormEntity[]>();

  const [submitForm, setSubmitForm] = useState<CreateCampaignDto>()

  const findAllFormsByWorkspaceId = (workspaceId: string) => {
    api.form
      .getForms(workspaceId)
      .then((response) => {
        setForms(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const findAll = (workspaceId: string) => {
    api.campaign
      .findAll(workspaceId)
      .then((response) => {
        setCampaigns(response);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const findOne = (id: string) => {
    api.campaign
      .findOne(id)
      .then((response) => {
        setCampaign(response);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const update = async () => {
    if (!campaign || !campaign.id) {
      toast.error('No campaign selected');
      return;
    }
    try {
      await api.campaign.update(campaign.id, {});
      toast.success('Campaign updated successfully');
    } catch (error) {
      toast.error('Failed to update campaign');
    }
  };
  const deleteOne = async (id: string) => {
    if (!id) return;
    try {
      await api.campaign.deleteOne(id);
      setCampaigns((prevCampaigns) => prevCampaigns?.filter((c) => c.id !== id));
      toast.success('Campaign deleted successfully');
    } catch (error) {
      toast.error('Failed to delete campaign');
    }
  }
  const create = async (dto: CreateCampaignDto) => {
    if (!dto) return;
    try {
      const response = await api.campaign.create(dto);
      setCampaigns((prevCampaigns) => [...(prevCampaigns || []), response]);
      toast.success('Campaign created successfully');
    } catch (error) {
      toast.error('Failed to create campaign');
    }
  }

  const sendCampaign = async (isTest: boolean) => {
    if (!submitForm || !user) {
      toast.error(`Please fill out the form before sending a ${isTest ? 'test' : ''} campaign`);
      return;
    }
    try {
      const validatedDto = createCampaignSchema.parse({
        ...submitForm,
        isTest: isTest,
      })
      await api.campaign.create(validatedDto);
      toast.success(`Campaign ${isTest ? 'test ' : ''}sent successfully`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send campaign');
    }
  }

  // const fetchData = async (
  //   pageIndex: number,
  //   pageSize: number,
  //   sorting: any,
  //   columnFilters: any,
  // ) => {
  //   if (!defaultWorkspace) {
  //     return null;
  //   }
  //   const res = await api.campaign.findAll({
  //     workspaceId: defaultWorkspace?.id || '',
  //     page: parseInt(params.get('page') || '1'),
  //     pageSize: parseInt(params.get('limit') || '10'),
  //     sortBy: 'createdAt',
  //     sortOrder: 'desc',
  //   });
  //   // setTotalServerRowCount(res.meta.total); // Update total count if you need to display it
  //   return {
  //     data: res.items,
  //     pageCount: res.meta.total,
  //     totalRowCount: res.meta.total, // Pass totalRowCount if your pagination component uses it
  //   };
  // };

  useEffect(() => {
    if (!user || !defaultWorkspace) {
      return;
    }
    findAll(defaultWorkspace.id);
    findAllFormsByWorkspaceId(defaultWorkspace.id);
  }, [user, defaultWorkspace]);

  useEffect(() => {
    if (!user || !defaultWorkspace || !campaigns || !forms) {
      return;
    }
    setSubmitForm({
      workspaceId: defaultWorkspace.id || '',
      formId: forms?.[0]?.id || '',
      name: `${user.name || 'User'}'s Campaign ${campaigns.length || 0}`,
      fromName: `${user.name || ''}`,
      fromEmail: 'reply@mail.reviewsup.io',
      toEmails: ['wsyanligang@gmail.com', '123@gmail.com'],
      subject: 'We would love to hear your feedback. {{name}}',
      content: `Hi {{name}},

Your feedback is incredibly important in helping us improve and provide the best possible experience.
Would you kindly take a moment to click the link below and share your thoughts? Your insights mean the world to us!

Thank you so much for your support!

Cheers,  
${user.name}  
      `,
      isTest: false,
      buttonText: 'Leave a testimonial',
    });

  }, [user, defaultWorkspace, campaigns, forms]);

  return (
    <CampaignContext.Provider
      value={{
        forms,
        campaigns,
        campaign,
        findAll,
        findOne,
        update,
        deleteOne,
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
