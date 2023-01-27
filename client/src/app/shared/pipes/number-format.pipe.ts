import { Pipe, PipeTransform } from '@angular/core';
import { SystemSettingsShareService } from '../../core/services';
import { formatNumber } from '@angular/common';

@Pipe({
  name: 'cbsNumberFormat'
})

export class NumberFormatPipe implements PipeTransform {
  private readonly numberFormat: string;

  constructor(private systemSettingsShareService: SystemSettingsShareService) {
    this.numberFormat = this.systemSettingsShareService.getData('NUMBER_FORMAT');
  }

  transform(value: any) {
    let format;
    if (value) {
      format = formatNumber(value, 'en', this.numberFormat);
      return format;
    }
    return value;
  }
}
