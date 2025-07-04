import { CreateFormDto, FormEntity, UpdateFormDto } from '@reviewsup/api/forms';
import { Form } from '@reviewsup/database/generated/client/client';
import { authFetch } from './auth-fetch';

export const form = {
  getForms: (workspaceId: string): Promise<FormEntity[]> =>
    authFetch(`/forms/workspaceId/${workspaceId}`, 'GET', {}),

  getForm: (id: string): Promise<FormEntity> =>
    authFetch(`/forms/${id}`, 'GET', {}),

  getFormByShortId: (shortId: string): Promise<FormEntity> =>
    authFetch(`/forms/shortId/${shortId}`, 'GET', {}),

  createForm: (dto: CreateFormDto): Promise<Form> =>
    authFetch('/forms', 'POST', dto),

  updateForm: (id: string, dto: UpdateFormDto) =>
    authFetch(`/forms/${id}`, 'PATCH', dto),

  deleteForm: (id: string) => authFetch(`/forms/${id}`, 'DELETE', {}),
};
