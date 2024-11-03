export const EXPENSE_TYPE = {
  FUEL: 'Tankowanie',
  SERVICE: 'Serwis',
  PARKING: 'Parking',
  OTHER: 'Inne',
} as const;

export type ExpenseType = (typeof EXPENSE_TYPE)[keyof typeof EXPENSE_TYPE];
