import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CustomFieldValue } from '../../../core/models';
import { get } from 'lodash'
import * as moment from 'moment';

@Component({
  selector: 'cbs-fields-readonly',
  templateUrl: 'fields-readonly.component.html',
  styleUrls: ['fields-readonly.component.scss']
})
export class FieldReadonlyComponent implements OnInit {
  @Input() fieldsData: Object[];
  @Input() showProfileInfoLink = false;
  @Output() onShowProfileInfoLinkClick = new EventEmitter();
  public yearsFromNow = null;
  public gridHeaders = [];
  public gridValues = [];

  ngOnInit() {
    for (const value of this.fieldsData) {
      if (value['fieldType'] === 'AGE') {
        const date = moment(value['value']).format('YYYY-MM-DD');
        this.yearsFromNow = moment().diff(date, 'years');
      }

      if (value['fieldType'] === 'GRID') {
        this.gridValues = value['value']
          ? JSON.parse(value['value']).data
          :  value['extra'].data;
        for (const i in this.gridValues[0]) {
          this.gridHeaders.push({
            value: i
          });
        }
      }
    }
  }

  getLookupValue(val) {
    if (val) {
      return val.name ? val.name : '-';
    }
  }

  isProfileFieldType(field: CustomFieldValue) {
    const extraKey = get(field, 'extra.key', '');
    return extraKey === 'profiles/people' || extraKey === 'profiles/company'
  }

  calculateTotal(colKey) {
    let total = 0;
    this.gridValues.map(val => {
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
