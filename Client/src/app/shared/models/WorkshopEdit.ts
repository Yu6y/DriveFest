import { Tag } from './Tag';

export type WorkshopEdit = {
  id: number;
  name: string;
  image: string;
  photoURL: File | null;
  location: string;
  address: string;
  voivodeship: string;
  tags: Tag[];
  description: string;
};
