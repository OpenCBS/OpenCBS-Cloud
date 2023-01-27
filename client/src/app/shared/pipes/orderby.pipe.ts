import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cbsOrderBy',
  pure: false,
})

export class OrderByPipe implements PipeTransform {
  transform(input: any, propertyName: string, orderDirection: number): any {
    if (propertyName && orderDirection && input && Array.isArray(input)) {
      let result: any = input.sort((a, b) => {
        if (this.getProperty(a, propertyName) < this.getProperty(b, propertyName)) {
          return -1;
        }
        if (this.getProperty(a, propertyName) > this.getProperty(b, propertyName)) {
          return 1;
        }
        return 0;
      });

      if (orderDirection < 0) {
        return result.reverse();
      }
    }
    return input;
  }


  getProperty(obj: any, propertyName: string): any {
    let propertyParts: string[] = propertyName.split('.');
    let propertyValue = obj;
    for (let i = 0; i < propertyParts.length; i++) {
      propertyValue = propertyValue[propertyParts[i]];
    }
    return propertyValue;
  }
}
