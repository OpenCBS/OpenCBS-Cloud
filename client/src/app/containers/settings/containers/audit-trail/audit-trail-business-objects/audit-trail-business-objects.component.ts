import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../../core/core.reducer';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { environment } from '../../../../../../environments/environment';
import * as fromStore from '../../../../../core/store';
import { NavigationExtras, Router } from '@angular/router';
import { Observable ,  Subscription } from 'rxjs';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { IAuditTrailObjects } from '../../../../../core/store/audit-trail';
import { RoleService } from '../../../../../core/store';
import { TranslateService } from '@ngx-translate/core';
import { HistoryLogService } from '../shared/services/history-log.service';
import { map } from 'rxjs/operators';

const SVG_DATA = {
  collection: 'standard',
  class: 'social',
  name: 'social'
};

@Component({
  selector: 'cbs-audit-trail-business-objects',
  templateUrl: 'audit-trail-business-objects.component.html',
  styleUrls: ['audit-trail-business-objects.component.scss']
})
export class AuditTrailBusinessObjectsComponent implements OnInit, OnDestroy {
  public docDefinition;
  public svgData = SVG_DATA;
  public breadcrumbLinks = [
    {
      name: 'SETTINGS',
      link: '/settings'
    },
    {
      name: 'AUDIT_TRAIL',
      link: '/settings/audit-trails'

    },
    {
      name: 'AUDIT_TRAIL_BUSINESS_OBJECTS',
      link: ''
    }
  ];
  public auditTrailObjects: IAuditTrailObjects;
  public form: FormGroup;
  public isLoading = false;
  public auditTrailData: Observable<IAuditTrailObjects>;
  public fromDate = moment().startOf('month').format(environment.DATE_FORMAT_MOMENT);
  public toDate = moment().format(environment.DATE_FORMAT_MOMENT);
  public queryObject = {
    fromDate: moment().startOf('month').format(environment.DATE_FORMAT_MOMENT),
    toDate: moment().format(environment.DATE_FORMAT_MOMENT),
    page: 1,
    username: '',
    size: 20,
  };
  public reportType = 'BUSINESS_OBJECT';
  public isOpen = false;
  public action: string;
  public historyList: any;

  private username: any;
  private currentUserSub: Subscription;
  private auditTrailSub: Subscription;
  private currentPageSub: Subscription;

  constructor(private auditTrailObjects$: Store<IAuditTrailObjects>,
              private historyLogService: HistoryLogService,
              private roleService: RoleService,
              private translateService: TranslateService,
              private router: Router,
              private fb: FormBuilder,
              private store$: Store<fromRoot.State>) {
  }

  ngOnInit() {
    this.currentUserSub = this.store$.pipe(select(fromRoot.getCurrentUserState)).subscribe(userState => {
      if ( userState['loaded'] && !userState['error'] && userState['success'] ) {
        this.username = userState.username;
      }
    });

    this.auditTrailObjects$.dispatch(new fromStore.LoadAuditTrail({
      reportType: this.reportType,
      params: {
        ...this.queryObject,
        username: this.username
      }
    }));

    this.auditTrailSub = this.store$.pipe(select(fromRoot.getAuditTrailObjectsState)).subscribe(
      (state: IAuditTrailObjects) => {
        this.auditTrailObjects = state;
      });

    this.auditTrailData = this.store$.pipe(select(fromRoot.getAuditTrailObjectsState));
    this.currentPageSub = this.auditTrailData
      .pipe(this.getCurrentPage())
      .subscribe(
        (page: number) => {
          this.queryObject = Object.assign(
            {},
            this.queryObject,
            {
              page: page
            });
        });

    this.form = this.fb.group({
      start: new FormControl(moment().startOf('month').format(environment.DATE_FORMAT_MOMENT), Validators.required),
      end: new FormControl(moment().format(environment.DATE_FORMAT_MOMENT), Validators.required),
    });
  }

  getCurrentPage = () => {
    return state => state
      .pipe(map(s => s['currentPage']));
  };

  getActionValue(data) {
    if ( data.requestType === 'GROUP_CREATE'
      || data.requestType === 'COMPANY_CREATE'
      || data.requestType === 'PEOPLE_CREATE'
      || data.requestType === 'ACCOUNT_CREATE'
      || data.requestType === 'ROLE_CREATE'
      || data.requestType === 'USER_CREATE'
      || data.requestType === 'LOAN_PRODUCT_CREATE'
      || data.requestType === 'SAVING_PRODUCT_CREATE'
      || data.requestType === 'TERM_DEPOSIT_CREATE' ) {
      return 'CREATE'
    } else {
      return 'EDIT'
    }
  }

  getValueDescription(data) {
    if ( data.requestType === 'GROUP_CREATE' ) {
      return this.translateService.instant('GROUP') + ': ' + data.description
    } else if ( data.requestType === 'GROUP_EDIT' ) {
      return this.translateService.instant('GROUP') + ': ' + data.description
    } else if ( data.requestType === 'COMPANY_CREATE' ) {
      return this.translateService.instant('COMPANY') + ': ' + data.description
    } else if ( data.requestType === 'COMPANY_EDIT' ) {
      return this.translateService.instant('COMPANY') + ': ' + data.description
    } else if ( data.requestType === 'PEOPLE_CREATE' ) {
      return this.translateService.instant('PEOPLE') + ': ' + data.description
    } else if ( data.requestType === 'PEOPLE_EDIT' ) {
      return this.translateService.instant('PEOPLE') + ': ' + data.description
    } else if ( data.requestType === 'ACCOUNT_CREATE' ) {
      return this.translateService.instant('ACCOUNT') + ': ' + data.description
    } else if ( data.requestType === 'ACCOUNT_EDIT' ) {
      return this.translateService.instant('ACCOUNT') + ': ' + data.description
    } else if ( data.requestType === 'ROLE_CREATE' ) {
      return this.translateService.instant('ROLE') + ': ' + data.description
    } else if ( data.requestType === 'ROLE_EDIT' ) {
      return this.translateService.instant('ROLE') + ': ' + data.description
    } else if ( data.requestType === 'USER_CREATE' ) {
      return this.translateService.instant('USER') + ': ' + data.description
    } else if ( data.requestType === 'USER_EDIT' ) {
      return this.translateService.instant('USER') + ': ' + data.description
    } else if ( data.requestType === 'LOAN_PRODUCT_CREATE' ) {
      return this.translateService.instant('LOAN_PRODUCT') + ': ' + data.description
    } else if ( data.requestType === 'LOAN_PRODUCT_EDIT' ) {
      return this.translateService.instant('LOAN_PRODUCT') + ': ' + data.description
    } else if ( data.requestType === 'SAVING_PRODUCT_CREATE' ) {
      return this.translateService.instant('SAVING_PRODUCT') + ': ' + data.description
    } else if ( data.requestType === 'SAVING_PRODUCT_EDIT' ) {
      return this.translateService.instant('SAVING_PRODUCT') + ': ' + data.description
    } else if ( data.requestType === 'TERM_DEPOSIT_PRODUCT_CREATE' ) {
      return this.translateService.instant('TERM_DEPOSIT_PRODUCT') + ': ' + data.description
    } else if ( data.requestType === 'TERM_DEPOSIT_PRODUCT_EDIT' ) {
      return this.translateService.instant('TERM_DEPOSIT_PRODUCT') + ': ' + data.description
    }
  }

  showMore(data) {
    this.historyLogService.getHistoryLog(data).subscribe(res => {
      this.historyList = res;
      this.isOpen = true;
    });
  }

  goToPage(page: number) {
    this.queryObject.page = page;
    const navigationExtras: NavigationExtras = {
      queryParams: {
        ...this.queryObject,
        username: this.username,
        page
      }
    };
    this.router.navigate(['/audit-trail', 'business-objects'], navigationExtras);
    this.auditTrailObjects$.dispatch(new fromStore.LoadAuditTrail({
      reportType: this.reportType,
      params: {
        ...this.queryObject,
        username: this.username
      }
    }));
  }

  filter() {
    this.auditTrailObjects$.dispatch(new fromStore.ResetAuditTrail());
    this.queryObject = {
      fromDate: this.form.value.start,
      toDate: this.form.value.end,
      page: 1,
      username: this.username,
      size: 20
    };
    this.auditTrailObjects$.dispatch(new fromStore.LoadAuditTrail({
      reportType: this.reportType,
      params: {
        ...this.queryObject,
        username: this.username
      }
    }));
    this.goToPage(1)
  }

  download() {
    this.isLoading = true;
    const queryObject = {
      fromDate: this.form.value.start || moment().startOf('month').format(environment.DATE_FORMAT_MOMENT),
      toDate: this.form.value.end || moment().format(environment.DATE_FORMAT_MOMENT),
      page: 0,
      username: this.username,
      size: this.auditTrailObjects.totalElements
    };

    this.auditTrailObjects$.dispatch(new fromStore.LoadAuditTrail({
      reportType: this.reportType,
      params: queryObject
    }));

    setTimeout(() => {
      const dataObjects = [];
      dataObjects.push([
        {text: 'Date'.toUpperCase(), style: 'header'},
        {text: 'User'.toUpperCase(), style: 'header'},
        {text: 'Action'.toUpperCase(), style: 'header'},
        {text: 'Type'.toUpperCase(), style: 'header'},
        {text: 'Description'.toUpperCase(), style: 'header'}
      ]);

      this.auditTrailObjects.auditTrailObjects.forEach((item) => {
        dataObjects.push([
          {text: item.dateTime ? moment(item.dateTime).format(environment.DATE_TIME_FORMAT_PDF) : '', style: 'content'},
          {text: item.username, bold: true, style: 'content'},
          {text: item.action.toLowerCase(), style: 'content'},
          {text: this.translateService.instant(item.requestType), style: 'content'},
          {text: item.description ? item.description : '-', style: 'content'}
        ]);
      });
      this.docDefinition = {
        content: [
          {
            layout: {hLineColor: '#d8dde6', vLineColor: '#d8dde6'},
            table: {
              headerRows: 1,
              widths: ['auto', '*', '*', '*', '*'],
              body: dataObjects
            }
          }
        ],
        styles: {
          content: {margin: [5, 0, 0, 0], fontSize: 10, color: '#16325c', lineHeight: 1.25},
          header: {fillColor: '#eeeeee', margin: [5, 0, 0, 0], fontSize: 10, color: '#54698d'}
        },
        pageSize: 'A4',
        pageOrientation: 'landscape',
      };
      pdfMake.createPdf(this.docDefinition).download('audit-trail-objects.pdf');
    }, 500);

    setTimeout(() => {
      this.auditTrailObjects$.dispatch(new fromStore.LoadAuditTrail({
        reportType: this.reportType,
        params: {
          ...this.queryObject,
          username: this.username
        }
      }));
      this.isLoading = false;
    }, 1000);
  }

  valid() {
    this.fromDate = this.form.value.start;
  }

  ngOnDestroy() {
    this.auditTrailSub.unsubscribe();
    this.auditTrailObjects$.dispatch(new fromStore.ResetAuditTrail());
    this.currentPageSub.unsubscribe();
    this.currentUserSub.unsubscribe();
  }
}
