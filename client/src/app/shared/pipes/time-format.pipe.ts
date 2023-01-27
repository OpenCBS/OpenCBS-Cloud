import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { SystemSettingsShareService } from '../../core/services';

@Pipe({
  name: 'cbsTimeFormat'
})

export class TimeFormatPipe implements PipeTransform {
  private readonly timeFormat: string;

  constructor(private systemSettingsShareService: SystemSettingsShareService) {
    this.timeFormat = this.systemSettingsShareService.getData('TIME_FORMAT');
  }

  transform(value: any) {
    let format;
    if (value) {
      format = moment(value).format(this.timeFormat);
      return format;
    }
    return value;
  }
}
