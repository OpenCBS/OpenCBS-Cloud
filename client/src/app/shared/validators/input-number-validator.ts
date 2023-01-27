import { AbstractControl } from '@angular/forms';

export function ValidateNumberField(control: AbstractControl) {
  let reg = new RegExp('^[0-9.]+$');
  return reg.test(control.value) ? {validNumber: true} : null;
}
