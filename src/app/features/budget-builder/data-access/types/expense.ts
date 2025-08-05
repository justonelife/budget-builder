import { Transaction } from './transaction';

export interface Expense {
  id: string;
  label: string;
  transactions: Transaction[];
}
