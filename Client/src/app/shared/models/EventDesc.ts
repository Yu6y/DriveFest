import { EventShort } from './EventShort';

export type EventDesc = EventShort & {
  eventDescId: number;
  address: string;
  description: string;
};
