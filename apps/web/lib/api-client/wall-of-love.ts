import { authFetch } from './auth-fetch';
import {
  UpdateWallOfLoveDto,
  WallOfLoveEntity,
} from '@reviewsup/api/walloflove';

export const wallOfLove = {
  findOneByProductId: (productId: string): Promise<WallOfLoveEntity> =>
    authFetch(`/walloflove/productId/${productId}`, 'GET', {}),

  updateOne: (id: string, dto: UpdateWallOfLoveDto) =>
    authFetch(`/walloflove/${id}`, 'PATCH', dto),

  deleteOne: (id: string) => authFetch(`/walloflove/${id}`, 'DELETE', {}),
};
