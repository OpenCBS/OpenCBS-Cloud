import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../reports/shared/reports.service';
import * as FileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { ShareService } from '../../../reports/shared/share.service';
import { environment } from '../../../../../environments/environment';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../core/core.reducer';
import { ILoanInfo } from '../../../../core/store';

const SVG_DATA = {
  collection: 'standard',
  class: 'timesheet',
  name: 'timesheet'
};

@Component({
  selector: 'cbs-print-out-preview',
  templateUrl: 'loan-print-out-preview.component.html',
  styles: [`:host ::ng-deep ngl-modal .slds-spinner_container {
    position: relative
  }`]
})

export class LoanPrintOutPreviewComponent implements OnInit {
  public isLoading = false;
  public reportName: string;
  public cancelLink: string;
  public svgData = SVG_DATA;
  public breadcrumbLinks = [];
  public formatTypes = [
    {
      name: 'Save as PDF',
      value: 'PDF'
    },
    {
      name: 'Save as CSV',
      value: 'CSV'
    }
  ];

  private reportHTMLData: any;
  private reportData: any;
  private breadcrumbPart: any;
  private loanSub: any;

  constructor(private reportService: ReportService,
              private toastrService: ToastrService,
              private router: Router,
              private loanStore$: Store<ILoanInfo>,
              private shareService: ShareService,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.isLoading = true;

    this.loanSub = this.loanStore$.pipe(select(fromRoot.getLoanInfoState)).subscribe((loanState: ILoanInfo) => {
      if ( loanState['loaded'] && !loanState['error'] && loanState['success'] ) {
        const loanId = loanState['loan']['id'];
        const loanProfile = loanState['loan']['profile'];
        this.cancelLink = `/loans/${loanId}/${loanProfile['type'].toLowerCase()}/print-out`;
        const profileType = loanProfile['type'] === 'PERSON' ? 'people'
          : loanProfile['type'] === 'COMPANY' ? 'companies'
            : 'groups';
        this.breadcrumbPart = profileType === 'groups' ? 'LOAN ' + loanId : loanState['loan']['code'];
        this.breadcrumbLinks = [
          {
            name: loanProfile['name'],
            link: `/profiles/${profileType['type']}/${loanProfile['id']}/info`
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
            name: 'PRINT_OUT',
            link: this.cancelLink
          },
          {
            name: 'PRINT_OUT_PREVIEW',
            link: ''
          }
        ];
      }
    });

    this.reportData = this.shareService.getData();
    if ( this.reportData && this.reportData.reportName ) {
      this.getReportData(this.reportData);
      this.reportName = this.reportData.reportLabel;
    }
  }

  getReportData(objToSend) {
    this.isLoading = true;
    this.reportService.getHtmlFile(objToSend)
      .subscribe(
        a => {
          if ( a['err'] ) {
            this.isLoading = false;
            this.translate.get('CREATE_ERROR').subscribe((res: string) => {
              this.toastrService.error(a['err'], res, environment.ERROR_TOAST_CONFIG);
            });
            this.router.navigateByUrl(this.cancelLink);
          } else {
            this.reportHTMLData = a;
            document.getElementById('content').innerHTML = `<object type="type/html" data="${this.reportHTMLData}" ></object>`
            this.isLoading = false;
          }
        });
  }

  selectFormat(formatType) {
    this.isLoading = true;
    this.submit(formatType)
  }

  submit(format) {
    const formatType = format === 'PDF' ? 'pdf' : 'csv';
    const reportData = {
      ...this.reportData,
      fieldsValues: {
        ...this.reportData.fieldsValues,
        format: format
      }
    };
    const date = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
    this.reportService.getFileReport(reportData).subscribe((a: any) => {
      if ( a['err'] ) {
        this.translate.get('CREATE_ERROR').subscribe((res: string) => {
          this.toastrService.error(a['err'], res, environment.ERROR_TOAST_CONFIG);
          this.isLoading = false;
        });
      } else {
        FileSaver.saveAs(a, `${this.reportData['reportName']} ${date}.${formatType}`);
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy() {
    this.loanSub.unsubscribe();
  }
}
