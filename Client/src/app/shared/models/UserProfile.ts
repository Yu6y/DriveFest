import { EventShort } from './EventShort';

export type UserProfile = {
  id: number;
  email: string;
  username: string;
  followedEvent: EventShort | null;
  userPic: string;
};
