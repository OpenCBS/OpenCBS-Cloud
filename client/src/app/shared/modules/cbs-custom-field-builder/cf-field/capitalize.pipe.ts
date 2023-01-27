import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cbsCapitalize'
})
export class CapitalizePipe implements PipeTransform {

  transform(value: any) {
    if (value) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return value;
  }

}
