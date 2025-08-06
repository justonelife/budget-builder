import { Transaction } from './transaction';

export interface Income {
  id: string;
  label: string;
  transactions: Transaction[];
  totals: number[];
}
