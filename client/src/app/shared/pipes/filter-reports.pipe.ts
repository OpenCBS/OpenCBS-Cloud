import { Pipe, PipeTransform } from '@angular/core';
import { filter } from 'lodash'

@Pipe({
  name: 'filterReports'
})
export class FilterReportsPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (args.length) {
      return filter(value, (report) => {
        const stringToSearch = `${report.group.toUpperCase()} ${report.label.toUpperCase()}`;
        return stringToSearch.indexOf(args.toUpperCase()) > -1
      });
    } else {
      return value
    }
  }
}
