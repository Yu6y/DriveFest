import { Tag } from './Tag';

export type EventShort = {
  id: number;
  name: string;
  image: string;
  date: string;
  location: string;
  followersCount: number;
  voivodeship: string;
  tags: Tag[];
  isFavorite: boolean;
  isVerified: boolean;
};
