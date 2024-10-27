import { WorkshopShort } from './WorkshopShort';

export type WorkshopDesc = WorkshopShort & {
  address: string;
  description: string;
  workshopDescId: number;
};
