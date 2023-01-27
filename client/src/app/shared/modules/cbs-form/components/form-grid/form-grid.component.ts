import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'cbs-form-grid',
  template: `
    <div [ngStyle]="style"
         [class]="styleClass ? styleClass : 'slds-form-element'"
         [formGroup]="group"
         [class.slds-has-error]="
            (group.get(config.name)?.errors?.required && group.get(config.name).touched)
            || (group.get(config.name)?.invalid && group.get(config.name).touched)">
      <label class="slds-form-element__label">
        <abbr class="slds-required" title="required"
              *ngIf="config.required">*</abbr>
        {{ config.caption }}
      </label>

      <div class="slds-form-element__control slds-box">
        <p-table [columns]="headers" [value]="values">
          <ng-template pTemplate="header" let-columns>
            <tr class="slds-border--bottom">
              <th *ngFor="let col of columns"
                  class="slds-app-launcher__header-search slds-border--left
                  slds-border--right slds-border--top slds-box--small slds-text-title--caps">
                {{col.value}}
              </th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-rowData let-columns="columns">
            <tr class="slds-border--bottom">
              <td pEditableColumn *ngFor="let col of columns"
                  class="slds-border--left slds-border--right slds-border--top slds-app-launcher__header-search">
                <p-cellEditor>
                  <ng-template pTemplate="input">
                    <input pInputText type="text"
                           [(ngModel)]="rowData[col.value]"
                           (ngModelChange)="getValues()"
                           [ngModelOptions]="{standalone: true}">
                  </ng-template>
                  <ng-template pTemplate="output">
                    {{rowData[col.value]}}
                  </ng-template>
                </p-cellEditor>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="footer" let-rowData>
            <tr class="slds-avatar--small">
              <td class="p-text-right slds-border--left slds-border--right slds-border--top slds-border--bottom
                     slds-app-launcher__header-search slds-text-title_caps">
                Total
              </td>
              <td *ngFor="let row of rowData.slice(1, rowData.length)"
                  class="slds-border--left slds-border--right slds-border--top slds-border--bottom
                            slds-app-launcher__header-search slds-text-title_caps">
                {{calculateTotal(row['value'])}}
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `,
  styleUrls: ['./form-grid.component.scss']
})
export class FormGridComponent implements OnInit, Field {
  @Input() config: FieldConfig;
  @Input() group: FormGroup;
  @Input() style: string;
  @Input() styleClass: string;
  public headers = [];
  public values = [];

  ngOnInit() {
    this.headers = [];

    if (this.config.value) {
      this.values =  JSON.parse(this.config.value).data;
    } else {
      this.values = cloneDeep(this.config.extra.data);
    }

    for (const i in this.config.extra.data[0]) {
      if (i !== 'id') {
        this.headers.push({
          value: i
        });
      }
    }
  }

  getValues() {
    let gridValue = {
      data: {}
    };
    gridValue.data = this.values;
    const senData = JSON.stringify(gridValue);
    this.group.controls[this.config.name].setValue(senData);
  }

  calculateTotal(colKey) {
    let total = 0;
    this.values.map(val => {
      for (const row in val) {
        if (row === colKey && val[row]) {
          total += parseInt(val[row]);
          break;
        }
      }
    });
    return total ? total : '';
  }
}
