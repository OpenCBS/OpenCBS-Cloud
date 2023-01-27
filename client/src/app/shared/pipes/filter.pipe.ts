import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cbsFilter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], term): any {
    return term
      ? items.filter(item => item.name.toLowerCase().indexOf(term) !== -1)
      : items;
  }
}
