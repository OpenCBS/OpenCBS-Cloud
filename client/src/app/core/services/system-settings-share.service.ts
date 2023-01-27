export class SystemSettingsShareService {
  private data: any;
  private newValue: any;

  public setData(data) {
    this.data = data;
  }

  public getData(value) {
    if ( this.data ) {
      this.data.map(res => {
        if ( res.name === value ) {
          this.newValue = res.value;
        }
      });
    }
    return this.newValue;
  }
}
