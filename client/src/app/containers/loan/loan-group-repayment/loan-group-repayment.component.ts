import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { ILoanInfo } from '../../../core/store';
import {
  LoanInstallmentsTableComponent
} from '../../../shared/components/cbs-loan-installments-table/loan-installments-table.component';
import { RepaymentService } from '../shared/services/repayment.service';
import { RepaymentFormComponent } from '../shared/components/repayment-form/repayment-form.component';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { GroupRepaymentService } from '../shared/services/group-repayment.service';
import { round } from 'lodash'

const ROW_FIELDS_TO_UPDATE_ROW_TOTAL = ['principal_payment', 'penalty_payment', 'interest_payment'];
const SVG_DATA = {
  collection: 'custom',
  class: 'custom41',
  name: 'custom41'
};

interface TableInputData {
  columns: string[];
  types: any[];
  rows: any[];
  totals?: any[];
}

@Component({
  selector: 'cbs-loan-group-repayment',
  templateUrl: './loan-group-repayment.component.html',
  styleUrls: ['./loan-group-repayment.component.scss']
})

export class LoanGroupRepaymentComponent implements OnInit, OnDestroy {
  @ViewChild(LoanInstallmentsTableComponent, {static: false}) installmentsTableComponent: LoanInstallmentsTableComponent;
  @ViewChild(RepaymentFormComponent, {static: false}) formComponent: RepaymentFormComponent;
  @ViewChild('submitButton', {static: false}) submitButton: ElementRef;
  @ViewChild('previewButton', {static: false}) previewButton: ElementRef;
  public installments: any;
  public svgData = SVG_DATA;
  public loan: Observable<ILoanInfo>;
  public isOpen = false;
  public tableData = [];
  public tableColumns = [];
  public data = [];
  public members = [];
  public repayData = [];
  public breadcrumb = [];
  public selectedColumns: any;
  public breadcrumbPart: string;
  public profileType: string;
  public isLoading = true;
  public bachRepayDate = moment().format(environment.DATE_FORMAT_MOMENT);

  private loanId: number;
  private loanType: string;
  private loanSub: any;
  private routeSub: any;
  private isLeaving = false;
  private nextRoute: string;
  private isSubmitting = false;
  private loanState: ILoanInfo;


  constructor(private loanStore$: Store<ILoanInfo>,
              private route: ActivatedRoute,
              private router: Router,
              private loanInfoStore$: Store<ILoanInfo>,
              private renderer2: Renderer2,
              private store$: Store<fromRoot.State>,
              private translate: TranslateService,
              private toastrService: ToastrService,
              private repaymentService: RepaymentService,
              private groupRepaymentService: GroupRepaymentService) {
  }

  ngOnInit() {
    this.routeSub = this.route.parent.parent.params.subscribe((params: { id, loanType }) => {
      if ( params && params.id ) {
        this.loanId = params.id;
        this.loanType = params.loanType;
      }
    });

    const initialCheck = {
      repaymentType: 'NORMAL_REPAYMENT',
      timestamp: moment(this.bachRepayDate).hour(moment().hour()).minute(moment().minute()).format().slice(0, 19)
    };
    this.groupRepaymentService.getLoanGroupSchedule(this.loanId, initialCheck).subscribe((data) => {
      if ( data instanceof Object ) {
        if ( data.rows ) {
          const tableData = this.formatData(data);
          this.tableColumns = tableData.columns;
          this.tableData = tableData.tableData;
          this.selectedColumns = tableData.columns;
        }
      }
    });
    this.loan = this.store$.pipe(select(fromRoot.getLoanInfoState));

    this.loanSub = this.store$.pipe(select(fromRoot.getLoanInfoState)).subscribe(
      (loanState: ILoanInfo) => {
        this.members = loanState['loan']['members'];
        if ( loanState.success && loanState.loaded && loanState['loan'] ) {
          this.loanState = loanState;
          if ( loanState['loaded'] && !loanState['error'] && loanState['success'] ) {
            const loanProfile = loanState['loan'];
            this.profileType = loanProfile['type'] === 'PERSON' ? 'people'
              : loanProfile['type'] === 'COMPANY' ? 'companies'
                : 'groups';
            this.breadcrumbPart = this.profileType === 'groups'
              ? 'LOAN APPLICATION ' + loanState['loan']['loanApplicationId']
              : loanProfile['code'];
            this.breadcrumb = [
              {
                name: loanProfile['profile']['name'],
                link: `/profiles/${this.profileType}/${loanProfile['profile']['id']}/info`
              },
              {
                name: 'LOANS',
                link: '/loans'
              },
              {
                name: this.breadcrumbPart,
                link: ''
              },
              {
                name: 'OPERATIONS',
                link: `/loans/${loanProfile['id']}/operations`
              },
              {
                name: 'BATCH_REPAYMENT',
                link: ''
              }
            ];
            this.isLoading = false;
          }
        }
      });
  }

  repayDate(date) {
    if ( date ) {
      this.bachRepayDate = date;
      const initialCheck = {
        repaymentType: 'NORMAL_REPAYMENT',
        timestamp: moment(this.bachRepayDate).hour(moment().hour()).minute(moment().minute()).format().slice(0, 19)
      };
      this.groupRepaymentService.getLoanGroupSchedule(this.loanId, initialCheck).subscribe((data) => {
        if ( data.error ) {
          this.toastrService.error(data.message, '', environment.ERROR_TOAST_CONFIG);
        } else if ( data instanceof Object ) {
          if ( data.rows ) {
            const tableData = this.formatData(data);
            this.tableColumns = tableData.columns;
            this.tableData = tableData.tableData;
            this.selectedColumns = tableData.columns;
          }
        }
      });
    }
  }

  calculateTotal(fieldValue, col, row) {
    if ( fieldValue === '' ) {
      fieldValue = '0.00';
    }

    this.tableData.map(rowData => {
      // Select proper row to update
      if ( rowData.name === row.name ) {
        // Update table data to have the updated new value
        rowData[col.field] = fieldValue;
        // Calculate row total
        rowData.total = ROW_FIELDS_TO_UPDATE_ROW_TOTAL.reduce((total, field) => {
          return round(total + parseFloat(rowData[field]), 2);
        }, 0)
      }
    });

    // Update `total` row column totals
    [...ROW_FIELDS_TO_UPDATE_ROW_TOTAL, 'total'].map(fieldName => {
      this.tableData[this.tableData.length - 1][fieldName] = this.tableData
        .filter(rowData => rowData.name !== 'Total').reduce((total, rowData) => {
          return round(total + parseFloat(rowData[fieldName]), 2);
        }, 0)
    });
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
              obj[columns[index].field] = dataRowItem.toString();
              if ( obj[columns[index].field].split('.')[1] && obj[columns[index].field].split('.')[1].length < 2 ) {
                obj[columns[index].field] = obj[columns[index].field] + '0';
              }
              if ( Number.isInteger(dataRowItem) ) {
                obj[columns[index].field] = obj[columns[index].field] + '.00';
              }
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
            data.types[index] === 'DECIMAL' ? obj[columns[index].field] = '0.00' : obj[columns[index].field] = '-'
          } else {
            obj[columns[index].field] = item.toString();
            if ( obj[columns[index].field].split('.')[1] && obj[columns[index].field].split('.')[1].length < 2 ) {
              obj[columns[index].field] = obj[columns[index].field] + '0';
            }
            if ( Number.isInteger(item) ) {
              obj[columns[index].field] = obj[columns[index].field] + '.00';
            }
          }
        }
      });
      tableData.push(obj);
    }
    return {columns, tableData};
  }

  rowStyleClass(row) {
    if ( row['name'] === 'Total' ) {
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

  cancel() {
    this.repaymentService.announceRepaymentActiveChange(false);
    this.router.navigate(['loans', this.loanId, 'operations']);
  }

  repay(data) {
    for (let i = 0; i < (this.members.length); i++) {
      this.repayData.push({
        loanId: this.members[i].loanId,
        date: this.bachRepayDate,
        repaymentType: 'NORMAL_MANUAL_REPAYMENT',
        interest: parseFloat(data[i]['interest_payment'].replace(/,/g, '')).toString(),
        principal: parseFloat(data[i]['principal_payment'].replace(/,/g, '')).toString(),
        penalty: parseFloat(data[i]['penalty_payment'].replace(/,/g, '')).toString(),
        timestamp: moment(data.date).hour(moment().hour()).minute(moment().minute()).format().slice(0, 19)
      });
    }
    this.groupRepaymentService.repay(this.repayData)
      .subscribe(res => {
        if ( res.error ) {
          this.disableBtn(this.submitButton.nativeElement, false);
          this.toastrService.clear();
          this.toastrService.error(res.message ? res.message : 'ERROR', '', environment.ERROR_TOAST_CONFIG);
          this.repayData = [];
        } else {
          this.isSubmitting = true;
          this.loanInfoStore$.dispatch(new fromStore.LoadLoanInfo({id: this.loanId, loanType: this.loanType}));
          this.toastrService.clear();
          this.translate.get('REPAY_SUCCESS').subscribe((message: string) => {
            this.toastrService.success(message, '', environment.SUCCESS_TOAST_CONFIG);
          });
          this.router.navigate(['/loans', this.loanId, 'info']);
          this.repayData = [];
        }
      });
  }

  disableBtn(btn, bool) {
    this.renderer2.setProperty(btn, 'disabled', bool);
  }

  canDeactivate(url?) {
    this.nextRoute = url;
    if ( !this.isSubmitting ) {
      this.isOpen = true;
      return this.isLeaving;
    } else {
      return true;
    }
  }

  goToNextRoute() {
    this.isLeaving = true;
    this.router.navigateByUrl(this.nextRoute);
  }

  closeConfirmPopup() {
    this.isOpen = false;
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.loanSub.unsubscribe();
    this.repaymentService.announceRepaymentActiveChange(false);
  }
}
