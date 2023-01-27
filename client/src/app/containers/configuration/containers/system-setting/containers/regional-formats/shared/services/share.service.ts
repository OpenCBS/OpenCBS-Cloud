export class ShareService {
  private dateFormat: any;
  private timeFormat: any;
  private numberFormat: any;
  private useDecimal: any;
  private decimalValue: any;
  private showButton: any;

  public setData(data, type) {
    switch (type) {
      case 'DATE_FORMAT':
        this.dateFormat = data;
        break;
      case 'TIME_FORMAT':
        this.timeFormat = data;
        break;
      case 'NUMBER_FORMAT':
        this.numberFormat = data;
        break;
      case 'USE_DECIMAL':
        this.useDecimal = data;
        break;
      case 'DECIMAL_VALUE':
        this.decimalValue = data;
        break;
      case 'SHOW_BUTTON':
        this.showButton = data;
        break;
    }
  }

  public getData(type) {
    let temp;
    switch (type) {
      case 'DATE_FORMAT':
        temp = this.dateFormat;
        break;
      case 'TIME_FORMAT':
        temp = this.timeFormat;
        break;
      case 'NUMBER_FORMAT':
        temp = this.numberFormat;
        break;
      case 'USE_DECIMAL':
        temp = this.useDecimal;
        break;
      case 'DECIMAL_VALUE':
        temp = this.decimalValue;
        break;
      case 'SHOW_BUTTON':
        temp = this.showButton;
        break;
    }
    return temp;
  }

  public clearData() {
    this.dateFormat = undefined;
    this.timeFormat = undefined;
    this.numberFormat = undefined;
    this.useDecimal = undefined;
    this.decimalValue = undefined;
    this.showButton = undefined;
  }
}
