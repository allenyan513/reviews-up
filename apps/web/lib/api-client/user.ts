import {authFetch} from './auth-fetch';
import {User} from '@repo/api/users/entities/user.entity';
import {YtDlpRequest} from "@repo/api/yt-dlp/yt-dlp-request.dto";
import {YtDlpResponse} from "@repo/api/yt-dlp/yt-dlp-response.dto";

export const user = {
  findOneBySlug: (slug: string): Promise<User | null> =>
    authFetch(`/users/slug/${slug}`, 'GET', {}),
};
