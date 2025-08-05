import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MONTHS } from '@features/budget-builder/data-access/consts/const';
import {
  ColSpanFullPipe,
  MonthSpanPipe,
} from '@features/budget-builder/data-access/pipes';
import { MonthRange, Income, Expense } from '@features/budget-builder/data-access/types';
import { Transaction } from '@features/budget-builder/data-access/types/transaction';
import { monthRangeValidator } from '@features/budget-builder/data-access/utils';
import { TypedForm } from '@shared/data-access/types/typed-form';
import { combineLatest, debounceTime, Subject, tap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

interface TableChanges {
  id: string | null | undefined;
  type: 'income' | 'expense' | undefined;
  subtype: 'transaction' | undefined;
  index: number | undefined;
  element: HTMLElement;
  value?: string | number | null;
}

@Component({
  imports: [CommonModule, ReactiveFormsModule, MonthSpanPipe, ColSpanFullPipe],
  selector: 'app-budget-builder',
  templateUrl: './budget-builder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block p-4',
  },
})
export class BudgetBuilderComponent {
  destroyRef = inject(DestroyRef);

  readonly MONTHS = MONTHS;

  monthRangeForm: TypedForm<MonthRange> = new FormGroup(
    {
      from: new FormControl<number | null>(1),
      to: new FormControl<number | null>(12),
    },
    {
      validators: [monthRangeValidator],
    },
  );

  incomes = signal<Income[]>([]);
  expenses = signal<Expense[]>([]);

  private tableChanges$ = new Subject<TableChanges>();
  private triggerSaveBy$ = new Subject<'enter' | 'blur' | null>();

  constructor() {
    combineLatest({
      triggerSaveBy: this.triggerSaveBy$,
      tableChanges: this.tableChanges$.pipe(debounceTime(300))
    }).pipe(
      tap(({ tableChanges, triggerSaveBy }) => {

        if (triggerSaveBy === 'blur') {
          // Only save by blur because enter triggers a blur event
          const { id, type, subtype, index, value } = tableChanges;

          if (id) {
            if (index !== undefined) {
              // Update transaction by id and index
              this.updateTransaction(id, index, type, value);
            } else if (subtype === 'transaction') {
              this.updateTransactionLabel(id, type, value);
            } else {
              this.updateParentCategoryLabel(id, type, value);
            }

          }
        }
      }),
      tap(value => {
        if (value.triggerSaveBy === 'enter') {
          // Enter triggers a blur event
          value.tableChanges.element.blur();
        }
        if (value.triggerSaveBy) {
          this.triggerSaveBy$.next(null);
        }
      }),
      takeUntilDestroyed()
    ).subscribe();
  }

  updateTransaction(id: string, index: number, type: 'income' | 'expense' | undefined, value: string | number | null | undefined): void {
    if (!type || !id || index === undefined) return;

    if (type === 'income') {
      this.incomes.update((incomes) => {
        return incomes.map(income => {
          const transactionIndex = income.transactions.findIndex((transaction) => transaction.id === id);
          if (transactionIndex === -1) return { ...income };
          const updatedTransactions = [...income.transactions];
          updatedTransactions[transactionIndex].monthlyValues[index] = value as number;

          return {
            ...income,
            transactions: updatedTransactions,
          };
        });

      });
    } else if (type === 'expense') {
      // TODO: DRY this with incomes
      this.expenses.update((expenses) => {
        return expenses.map(expense => {
          const transactionIndex = expense.transactions.findIndex((transaction) => transaction.id === id);
          if (transactionIndex === -1) return { ...expense };

          const updatedTransactions = [...expense.transactions];
          updatedTransactions[transactionIndex].monthlyValues[index] = value as number;

          return {
            ...expense,
            transactions: updatedTransactions,
          };
        });

      });
    }
  }

  updateTransactionLabel(id: string, type: 'income' | 'expense' | undefined, value: string | number | null | undefined): void {
    if (!type || !id) return;

    if (type === 'income') {
      this.incomes.update((incomes) => {
        return incomes.map(income => {
          const transactionIndex = income.transactions.findIndex((transaction) => transaction.id === id);

          if (transactionIndex === -1) return { ...income };

          const updatedTransactions = [...income.transactions];
          updatedTransactions[transactionIndex].label = value as string;

          return {
            ...income,
            transactions: updatedTransactions,
          };
        });
      });
    } else if (type === 'expense') {
      // TODO: DRY this with incomes
      this.expenses.update((expenses) => {
        return expenses.map(expense => {
          const transactionIndex = expense.transactions.findIndex((transaction) => transaction.id === id);

          if (transactionIndex === -1) return { ...expense };

          const updatedTransactions = [...expense.transactions];
          updatedTransactions[transactionIndex].label = value as string;

          return {
            ...expense,
            transactions: updatedTransactions,
          };
        });
      });
    }
  }

  updateParentCategoryLabel(id: string, type: 'income' | 'expense' | undefined, value: string | number | null | undefined): void {
    if (!type || !id) return;

    if (type === 'income') {
      this.incomes.update((incomes) => {
        const index = incomes.findIndex((income) => income.id === id);
        if (index === -1) return incomes;

        const updatedIncome = { ...incomes[index], label: value as string };
        const newIncomes = [...incomes];
        newIncomes[index] = updatedIncome;
        return newIncomes;
      });
    } else if (type === 'expense') {
      // TODO: DRY this with incomes
      this.expenses.update((expenses) => {
        const index = expenses.findIndex((expense) => expense.id === id);
        if (index === -1) return expenses;

        const updatedExpense = { ...expenses[index], label: value as string };
        const newExpenses = [...expenses];
        newExpenses[index] = updatedExpense;
        return newExpenses;
      });
    }
  }

  addParentCategoryIncome(label: string = 'New parent category'): void {
    this.incomes.update((value) => [
      ...value,
      this.generateParentCategory(label),
    ]);
  }

  addParentCategoryExpense(label: string = 'New parent category'): void {
    this.expenses.update((value) => [
      ...value,
      this.generateParentCategory(label),
    ]);
  }

  private generateParentCategory(label: string): Income {
    return {
      id: uuidv4(),
      label,
      transactions: [],
    };
  }

  addCategoryIncome(parentId: string, label: string = 'New category'): void {
    this.incomes.update((value) => {
      const index = value.findIndex((v) => v.id === parentId);
      const parentIncome = value[index];
      if (!parentIncome) return value;

      const newTransactions = [
        ...parentIncome.transactions,
        this.generateCategory(label),
      ];

      value.splice(index, 1, {
        ...parentIncome,
        transactions: newTransactions,
      });
      return [...value];
    });
  }

  addCategoryExpense(parentId: string, label: string = 'New category'): void {
    this.expenses.update((value) => {
      const index = value.findIndex((v) => v.id === parentId);
      const parentExpense = value[index];
      if (!parentExpense) return value;

      const newTransactions = [
        ...parentExpense.transactions,
        this.generateCategory(label),
      ];

      value.splice(index, 1, {
        ...parentExpense,
        transactions: newTransactions,
      });
      return [...value];
    });
  }

  private generateCategory(label: string = 'New category'): Transaction {
    return {
      id: uuidv4(),
      label,
      // monthlyValues: Array.from({ length: 12 }, () => 0),
      monthlyValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    };
  }

  tableInput(event: Event): void {
    const element = event.target as HTMLElement;
    const { id, type, subtype, index } = element?.dataset as unknown as TableChanges;
    let value: string | number | null = null;

    if (subtype === 'transaction' && index !== undefined) {
      // Only allow numbers in contenteditable
      const text = element.innerText;
      // Allow valid float values (e.g. 123, 123.45, .45, 0.5)
      const validFloatRegex = /^-?\d*\.?\d*$/;

      if (!validFloatRegex.test(text)) {
        // Remove invalid characters
        const temp = text?.match(/-?\d*\.?\d*/);
        const cleaned = temp?.length ? temp[0] : '';
        element.innerText = cleaned;
      }
      value = parseFloat(element.innerText);
      this.placeCaretAtEnd(element);
    } else {
      // For text fields like category labels
      value = element.innerText;
    }

    element.onblur = () => {
      this.triggerSaveBy$.next('blur');
      element.onblur = () => { }
    }
    let indexNumber = (index === undefined || index === null) ? undefined : parseInt(index as unknown as string, 10);

    this.tableChanges$.next({ element, id, type, subtype, index: indexNumber, value });
  }


  private placeCaretAtEnd(el: HTMLElement) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel?.removeAllRanges();
    sel?.addRange(range);
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.code === 'Enter') {
      event.preventDefault();
      this.triggerSaveBy$.next('enter');
    }
  }
}
