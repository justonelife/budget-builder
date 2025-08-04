import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type TypedForm<TFormData extends object> = FormGroup<{
  [TFormKey in keyof TFormData]: TFormData[TFormKey] extends Date
    ? FormControl<Date>
    : TFormData[TFormKey] extends Array<infer TItem>
      ? TItem extends Date
        ? FormControl<Date[]>
        : TItem extends object
          ? FormArray<TypedForm<TItem>>
          : FormControl<TItem[]>
      : TFormData[TFormKey] extends object
        ? TypedForm<TFormData[TFormKey]>
        : FormControl<TFormData[TFormKey]>;
}>;
