import { Injectable } from '@angular/core';

@Injectable()
export class ParseDateFormatService {

  parseDateValue(date) {
    if ( date ) {
      const arr = date.includes('-')
        ? date.split('-')
        : date.includes('/')
          ? date.split('/')
          : date.split('.');
      let YYYY = '';
      let MM = '';
      let DD = '';
      if ( arr[0].length === 2 ) {
        YYYY = arr[2];
        MM = arr[1];
        DD = arr[0];
      } else {
        YYYY = arr[0];
        MM = arr[1];
        DD = arr[2];
      }
      date = YYYY + '-' + MM + '-' + DD;
    } else {
      date = '';
    }
    return date
  }
}
