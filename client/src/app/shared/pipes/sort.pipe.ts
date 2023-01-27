import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})

export class SortPipe implements PipeTransform {
  transform(array) {
    return array.sort((a, b) => a.name.localeCompare(b.name));
  }
}
