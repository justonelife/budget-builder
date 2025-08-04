import { Pipe, PipeTransform } from '@angular/core';
import { MonthRange } from '../types';
import { MONTHS } from '../consts/const';

@Pipe({
  name: 'monthSpan',
})
export class MonthSpanPipe implements PipeTransform {
  transform(range: MonthRange) {
    const { from: fromStr, to: toStr } = range;
    const from = parseInt(fromStr as unknown as string);
    const to = parseInt(toStr as unknown as string);
    if (!from || !to) return [];
    if (from > to) return [];
    return MONTHS.filter((m) => m.value >= from && m.value <= to);
  }
}
