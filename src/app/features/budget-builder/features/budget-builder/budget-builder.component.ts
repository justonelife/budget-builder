import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MONTHS } from '@features/budget-builder/data-access/consts/const';
import {
  ColSpanFullPipe,
  MonthSpanPipe,
} from '@features/budget-builder/data-access/pipes';
import { MonthRange } from '@features/budget-builder/data-access/types';
import { Income } from '@features/budget-builder/data-access/types/income';
import { Transaction } from '@features/budget-builder/data-access/types/transaction';
import { monthRangeValidator } from '@features/budget-builder/data-access/utils';
import { TypedForm } from '@shared/data-access/types/typed-form';
import { v4 as uuidv4 } from 'uuid';

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

  addParentCategoryIncome(label: string = 'New parent category'): void {
    this.incomes.update((value) => [
      ...value,
      this.generateParentCategoryIncome(label),
    ]);
  }

  private generateParentCategoryIncome(label: string): Income {
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

  private generateCategory(label: string = 'New category'): Transaction {
    return {
      id: uuidv4(),
      label,
      // monthlyValues: Array.from({ length: 12 }, () => 0),
      monthlyValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    };
  }

  tableInput(event: Event) {
    const element = event.target as HTMLElement;
    console.log(element?.dataset['id']);
  }
}
