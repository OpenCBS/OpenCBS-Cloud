import { AbstractControl, Validators, ValidatorFn } from '@angular/forms';

export function isPresent(obj: any): boolean {
  return obj !== undefined && obj !== null;
}

export const maximumum = (max: number): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: any } => {
    if (!isPresent(max)) {
      return null;
    }
    ;
    if (isPresent(Validators.required(control))) {
      return null;
    }
    ;

    let v: number = +control.value;
    return v <= +max ? null : {actualValue: v, requiredValue: +max, max: true};
  };
};


export const minimum = (min: number): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: any } => {
    if (!isPresent(min)) {
      return null;
    }
    ;
    if (isPresent(Validators.required(control))) {
      return null;
    }
    ;

    let v: number = +control.value;
    return v >= +min ? null : {actualValue: v, requiredValue: +min, min: true};
  };
};

export const range = (rangeArray: Array<number>): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: any } => {
    if (!isPresent(rangeArray)) {
      return null;
    }
    ;
    if (isPresent(Validators.required(control))) {
      return null;
    }
    ;

    let v: number = +control.value;
    return v >= rangeArray[0] && v <= rangeArray[1] ? null : {range: true};
  };
};
