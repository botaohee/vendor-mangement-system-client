import { AbstractControl } from '@angular/forms';

export function ValidateDecimal(control: AbstractControl): { invalidDecimal: boolean } {
  const DECIMAL_REGEXP = /^\d+(\.\d{1,2})?$/i;
  return !DECIMAL_REGEXP.test(control.value) ? {invalidDecimal: true} : null;
} // ValidatePhone
