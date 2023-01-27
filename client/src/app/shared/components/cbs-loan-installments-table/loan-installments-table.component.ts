import { Component, Input, SimpleChange, OnChanges, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { SystemSettingsShareService } from '../../../core/services';
import { formatNumber } from '@angular/common';

interface TableInputData {
  columns: string[];
  types: any[];
  rows: any[];
  totals?: any[];
}

@Component({
  selector: 'cbs-loan-installments-table',
  templateUrl: 'loan-installments-table.component.html',
  styleUrls: ['loan-installments-table.component.scss']
})
export class LoanInstallmentsTableComponent implements OnChanges {
  @Input() data;
  @Input() editableColumns = '';
  @Input() editablePaymentDate = '';
  @Output() onCellEdit = new EventEmitter();
  public tableData = [];
  public dateFormat: string;
  public numberFormat: string;
  public tableColumns = [];
  public isLoading = true;
  public numberFieldPaymentDate: number;
  selectedColumns: any[];

  constructor(private systemSettingsShareService: SystemSettingsShareService) {
    this.dateFormat = this.systemSettingsShareService.getData('DATE_FORMAT');
    this.numberFormat = this.systemSettingsShareService.getData('NUMBER_FORMAT');
  }

  ngOnChanges(changes: { data: SimpleChange }) {
    if ( changes && changes.data && changes.data.currentValue && changes.data.currentValue instanceof Object ) {
      if ( changes.data.currentValue.rows ) {
        const tableData = this.formatData(changes.data.currentValue);
        this.tableColumns = tableData.columns;
        this.tableData = tableData.tableData;
        this.selectedColumns = this.tableColumns;

        for (const el of this.tableData) {
          if (el.overdue === 'NOT_OVERDUE' && el.status === 'UNPAID') {
            this.numberFieldPaymentDate = el['#'];
            break;
          }
        }
      }
    }
  }

  formatData(data: TableInputData) {
    const columns = [],
      tableData = [];
    if ( data.columns && data.columns.length ) {
      data.columns.map((column: string, index: number) => {
        columns.push({
          field: column.toLowerCase().trim().split(' ').join('_'),
          header: column,
          type: data.types[index]
        });
      });
    } else {
      throw new Error(`Columns are not provided in table input data.`);
    }

    if ( data.rows && data.rows.length ) {
      data.rows.map((dataRow) => {
        const obj = {};
        if ( columns.length ) {
          dataRow.data.map((dataRowItem, index) => {
            if ( data.types[index] === 'DECIMAL' ) {
              obj[columns[index].field] = formatNumber(dataRowItem, 'en-US', this.numberFormat);
            } else if ( data.types[index] === 'DATE' ) {
              obj[columns[index].field] = moment(dataRowItem).format(this.dateFormat);
            } else {
              obj[columns[index].field] = dataRowItem;
            }
          });
          obj['status'] = dataRow.status;
          obj['overdue'] = dataRow.overdue;
        } else {
          throw new Error(`Columns are not provided in table input data.`);
        }
        tableData.push(obj);
      });
    }

    if ( data.totals && data.totals.length ) {
      const obj = {};
      data.totals.map((item, index) => {
        if ( index === 0 ) {
          obj[columns[index].field] = 'Total';
        } else {
          if ( !item ) {
            data.types[index] === 'DECIMAL'
              ? obj[columns[index].field] = formatNumber(item, 'en-US', this.numberFormat)
              : obj[columns[index].field] = '-'
          } else {
            obj[columns[index].field] = formatNumber(item, 'en-US', this.numberFormat);
          }
        }
      });
      tableData.push(obj);
    }


    return {columns, tableData};
  }

  rowStyleClass(row) {
    if ( row['#'] === 'Total' ) {
      return 'bold';
    }
    if ( row.status === 'PAID' ) {
      return 'paid';
    } else if ( row.status === 'UNPAID' && row.overdue === 'OVERDUE' ||
      row.status === 'PARTIALLY_PAID' && row.overdue === 'OVERDUE' ) {
      return 'late'
    } else {
      return ''
    }
  }

  columnStyleClass(column) {
    return column.type ? column.type.toLowerCase() : 'decimal';
  }
}
