import { Tag } from './Tag';

export type EventEdit = {
  id: number;
  name: string;
  image: string;
  photoURL: File | null;
  date: string;
  location: string;
  address: string;
  voivodeship: string;
  tags: Tag[];
  description: string;
};
