import { Tag } from './Tag';

export type WorkshopShort = {
  id: number;
  name: string;
  location: string;
  voivodeship: string;
  tags: Tag[];
  rate: number;
  image: string;
  ratesCount: number;
  isVerified: boolean;
};
