import { AbstractControl, ValidationErrors } from '@angular/forms';
import { TypedForm } from '@shared/data-access/types/typed-form';
import { MonthRange } from '../../types';

export const monthRangeValidator = (
  controls: AbstractControl,
): ValidationErrors | null => {
  const form = controls as TypedForm<MonthRange>;
  if (form.controls.from.value == null || form.controls.to.value == null) {
    return null;
  }

  if (
    parseInt(form.controls.from.value as unknown as string) >
    parseInt(form.controls.to.value as unknown as string)
  ) {
    return { monthRangeInvalid: true };
  }

  return null;
};
