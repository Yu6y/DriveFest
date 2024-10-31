export type Expense = {
  id: number;
  type: 'Tankowanie' | 'Serwis' | 'Parking' | 'Inne';
  price: number;
  date: string;
  description: string;
};
