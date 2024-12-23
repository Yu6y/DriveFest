import { ExpenseType } from './ExpenseType';

export type Expense = {
  id: number;
  type: ExpenseType;
  price: number;
  date: string;
  description: string;
};
