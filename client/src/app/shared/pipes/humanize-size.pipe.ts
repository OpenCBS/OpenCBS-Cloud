import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cbsHumanizeSize'
})

export class HumanizeSizePipe implements PipeTransform {
  transform(value: any, args: any[]): any {
    if (value) {
      return this.humanizeBytes(value);
    } else {
      return value;
    }
  }

  humanizeBytes(bytes: number): string {
    if (bytes === 0) {
      return '0 Byte';
    }
    let k = 1024;
    const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    let i: number = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
