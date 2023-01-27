import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../../core/core.reducer';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { environment } from '../../../../../../environments/environment';
import * as fromStore from '../../../../../core/store';
import { NavigationExtras, Router } from '@angular/router';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { IAuditTrailObjects } from '../../../../../core/store/audit-trail';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

const SVG_DATA = {
  collection: 'custom',
  class: 'custom41',
  name: 'custom41'
};

@Component({
  selector: 'cbs-audit-trail-transactions',
  templateUrl: 'audit-trail-transactions.component.html',
  styleUrls: ['audit-trail-transactions.component.scss']
})

export class AuditTrailTransactionsComponent implements OnInit, OnDestroy {
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
      name: 'AUDIT_TRAIL_TRANSACTIONS',
      link: ''
    }
  ];
  public auditTrailObjects: IAuditTrailObjects;
  public form: FormGroup;
  public isLoading = false;
  public auditTrailData: any;
  public fromDate = moment().startOf('month').format(environment.DATE_FORMAT_MOMENT);
  public toDate = moment().format(environment.DATE_FORMAT_MOMENT);
  public queryObject = {
    fromDate: moment().startOf('month').format(environment.DATE_FORMAT_MOMENT),
    toDate: moment().format(environment.DATE_FORMAT_MOMENT),
    page: 1,
    username: '',
    size: 20,
  };
  public reportType = 'TRANSACTIONS';

  private username: any;
  private currentUserSub: Subscription;
  private auditTrailSub: Subscription;
  private currentPageSub: Subscription;

  constructor(private auditTrailObjects$: Store<IAuditTrailObjects>,
              private router: Router,
              private fb: FormBuilder,
              private store$: Store<fromRoot.State>) {
  }

  ngOnInit() {
    this.currentUserSub = this.store$.pipe(select(fromRoot.getCurrentUserState)).subscribe(userState => {
      if (userState['loaded'] && !userState['error'] && userState['success']) {
        this.username = userState.username;
      }
    });

    this.auditTrailObjects$.dispatch(new fromStore.LoadAuditTrail( {
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

    this.auditTrailData = this.auditTrailObjects$.pipe(select(fromRoot.getAuditTrailObjectsState));
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

  goToPage(page: number) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        ...this.queryObject,
        username: this.username,
        page
      }
    };
    this.router.navigate(['/audit-trail', 'transactions'], navigationExtras);
    this.auditTrailObjects$.dispatch(new fromStore.LoadAuditTrail(
      {
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
      page: 1,
      fromDate: this.form.value.start,
      toDate: this.form.value.end,
      username: this.username,
      size: 20
    };
    this.auditTrailObjects$.dispatch(new fromStore.LoadAuditTrail( {
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

    this.auditTrailObjects$.dispatch(new fromStore.LoadAuditTrail( {
      reportType: this.reportType,
      params: queryObject
    }));

    setTimeout(() => {
      const dataObjects = [];
      dataObjects.push([
        {text: 'Date'.toUpperCase(), style: 'header'}, {text: 'User'.toUpperCase(), style: 'header'},
        {text: 'Debit account'.toUpperCase(), style: 'header'}, {text: 'Credit account'.toUpperCase(), style: 'header'},
        {text: 'Amount'.toUpperCase(), style: ['header', 'rightText']}, {text: 'Description'.toUpperCase(), style: 'header'}
      ]);

      this.auditTrailObjects.auditTrailObjects.forEach((item) => {
        dataObjects.push([
          {text: moment(item.dateTime).format(environment.DATE_TIME_FORMAT_PDF), style: 'content'},
          {text: item.username, bold: true, style: 'content'},
          {text: item.debitAccount, style: 'content'},
          {text: item.creditAccount, style: 'content'},
          {text: item.amount, bold: true, style: ['content', 'rightText']},
          {text: item.description ? item.description : '-', style: 'content'},
        ]);
      });
        this.docDefinition = {
          content: [
            {
              layout: {hLineColor: '#d8dde6', vLineColor: '#d8dde6'},
              table: {
                headerRows: 1,
                widths: [ 'auto', 'auto', '*', '*', '*', '*' ],
                body: dataObjects
              }
            }
          ],
          styles: {
            content: { margin: [5, 0, 0, 0], fontSize: 10, color: '#16325c', lineHeight: 1.25 },
            rightText: { alignment: 'right' },
            header: { fillColor: '#eeeeee', margin: [5, 1, 1, 1], fontSize: 10, color: '#54698d', lineHeight: 1.25 }
          },
          pageSize: 'A4',
          pageOrientation: 'landscape',
        };
      pdfMake.createPdf(this.docDefinition).download('audit-trail-transactions.pdf');
    }, 500);

    setTimeout(() => {
      this.auditTrailObjects$.dispatch(new fromStore.LoadAuditTrail( {
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
