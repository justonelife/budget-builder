import { Pipe, PipeTransform } from '@angular/core';
import { MonthRange } from '../types';

@Pipe({
  name: 'colSpanFull',
})
export class ColSpanFullPipe implements PipeTransform {
  transform(range: MonthRange): number {
    const { from: fromStr, to: toStr } = range;
    const from = parseInt(fromStr as unknown as string);
    const to = parseInt(toStr as unknown as string);
    if (!from || !to) return 1;
    if (from > to) return 1;
    return to - from + 2;
  }
}
