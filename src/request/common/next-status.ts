import { Status } from '@prisma/client';

export const nextStatus: { [key in Status]?: Status } = {
  [Status.NEW]: Status.IN_PROGRESS,
  [Status.IN_PROGRESS]: Status.DONE,
  [Status.DONE]: Status.DONE,
};
