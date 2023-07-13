import { AbstractControl } from '@angular/forms';

export function ValidatePostalCode(control: AbstractControl): { invalidPostalCode: boolean } {
  const PHONE_REGEXP = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
  return !PHONE_REGEXP.test(control.value) ? {invalidPostalCode: true} : null;
} // ValidatePhone
