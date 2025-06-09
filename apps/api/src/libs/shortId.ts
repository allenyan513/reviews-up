import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('0123456789abcdef', 11);

export const generateShortId = (): string => {
  return nanoid();
};
