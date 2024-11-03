import { ExpenseType } from './ExpenseType';

export type EditExpense = {
  id: number;
  type: ExpenseType;
  price: number;
  date: string;
  description: string;
};
