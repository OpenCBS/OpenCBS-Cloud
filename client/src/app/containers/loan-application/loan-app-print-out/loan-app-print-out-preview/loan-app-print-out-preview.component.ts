import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../reports/shared/reports.service';
import * as FileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { ShareService } from '../../../reports/shared/share.service';
import { environment } from '../../../../../environments/environment';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../core/core.reducer';
import { ILoanAppState } from '../../../../core/store';
import { Subscription } from 'rxjs';

const SVG_DATA = {
  collection: 'standard',
  class: 'timesheet',
  name: 'timesheet'
};

@Component({
  selector: 'cbs-loan-app-print-out-preview',
  templateUrl: 'loan-app-print-out-preview.component.html',
  styles: [`:host ::ng-deep ngl-modal .slds-spinner_container {
    position: relative
  }`]
})

export class LoanAppPrintOutPreviewComponent implements OnInit {
  public isLoading = false;
  public reportName: string;
  public cancelLink: string;
  public svgData = SVG_DATA;
  public breadcrumb = [];
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

  private loanAppId: number;
  private reportHTMLData: any;
  private reportData: any;
  private loanApplicationSub: Subscription;

  constructor(private reportService: ReportService,
              private toastrService: ToastrService,
              private router: Router,
              private loanApplicationStore$: Store<ILoanAppState>,
              private shareService: ShareService,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.isLoading = true;

    this.loanApplicationSub = this.loanApplicationStore$.select(fromRoot.getLoanApplicationState).subscribe(
      (loanAppState: ILoanAppState) => {
        if (loanAppState.loaded && loanAppState.success) {
          this.loanAppId = loanAppState['loanApplication']['id'];
          const profile = loanAppState['loanApplication']['profile'];
          this.cancelLink = `/loan-applications/${this.loanAppId}/print-out`;
          const profileType = profile['type'] === 'PERSON' ? 'people'
            : profile['type'] === 'COMPANY' ? 'companies'
              : 'groups';
          const breadcrumbPart = profileType === 'groups' ? 'LOAN ' + this.loanAppId : loanAppState['loanApplication']['code'];
          this.breadcrumb = [
            {
              name: profile['name'],
              link: `/profiles/${profileType}/${profile['id']}/info`
            },
            {
              name: 'LOAN APPLICATIONS',
              link: '/loan-applications'
            },
            {
              name: breadcrumbPart,
              link: ''
            },
            {
              name: 'PRINT OUT',
              link: this.cancelLink
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
    this.loanApplicationSub.unsubscribe();
  }
}
