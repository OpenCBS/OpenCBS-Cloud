import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cbs-multiselect',
  template: `
    <p-multiSelect
      styleClass="table-multiselect"
      [filter]="filter"
      [showToggleAll]="false"
      [options]="options"
      [ngModel]="selectedOptions"
      (ngModelChange)="onSelectedOptionChange($event)"
      [panelStyleClass]="'slds-dropdown slds-dropdown_left'"
      optionLabel="header"
      selectedItemsLabel="{0} {{'COLUMNS_SELECTED' | translate}}"
      defaultLabel="Choose Columns">
      <ng-template let-option let-i="index" pTemplate="item">
        <div>{{option.label | translate}}</div>
      </ng-template>
    </p-multiSelect>
  `,
  styleUrls: ['./cbs-multiselect.scss']
})
export class CbsMultiselectComponent {
  @Input() options: any[];
  @Input() selectedOptions: any[];
  @Input() filter = false;
  @Output() selectedOptionsChange = new EventEmitter();

  onSelectedOptionChange(data) {
    const keys: any[] = data.map(x => x.field)
    const temp: any[] = [];

    for (const item of this.options) {
      if (keys.includes(item.field)) {
        temp.push(item);
      }
    }

    this.selectedOptionsChange.emit(temp)
  }
}
