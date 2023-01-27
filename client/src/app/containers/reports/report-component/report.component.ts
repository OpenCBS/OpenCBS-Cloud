import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReportService } from '../shared/reports.service';
import { environment } from '../../../../environments/environment';
import * as FileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { ShareService } from '../shared/share.service';

const SVG_DATA = {
  collection: 'standard',
  class: 'timesheet',
  name: 'timesheet'
};

@Component({
  selector: 'cbs-report',
  templateUrl: 'report.component.html',
  styles: [`:host ::ng-deep ngl-modal .slds-spinner_container {
      position: relative
  }`]
})

export class ReportComponent implements OnInit {
  public isLoading = false;
  public reportData: any;
  public reportHTMLData: any;
  public reportName: string;
  public svgData = SVG_DATA;
  public breadcrumbLinks = [];
  public formatTypes = [
    {
      name: 'Save as Excel',
      value: 'EXCEL'
    },
    {
      name: 'Save as PDF',
      value: 'PDF'
    },
    {
      name: 'Save as CSV',
      value: 'CSV'
    }
  ];

  constructor(private reportService: ReportService,
              public toastrService: ToastrService,
              private route: ActivatedRoute,
              private router: Router,
              private shareService: ShareService,
              public translate: TranslateService) {
  }


  ngOnInit() {
    this.isLoading = true;
    this.reportData = this.shareService.getData();
    if ( this.reportData && this.reportData.reportName ) {
      this.getReportData(this.reportData);
      this.reportName = this.reportData.reportLabel;
      this.breadcrumbLinks = [
        {
          name: 'REPORTS',
          link: '/report-list'
        },
        {
          name: this.reportName,
          link: ''
        }
      ];
    }
  }

  getReportData(objToSend) {
    this.isLoading = true;
    this.reportService.getHtmlFile(objToSend).subscribe(a => {
      if ( a['err'] ) {
        this.isLoading = false;
        this.translate.get('CREATE_ERROR').subscribe((res: string) => {
          this.toastrService.error(a['err'], res, environment.ERROR_TOAST_CONFIG);
        });
        this.router.navigateByUrl('report-list');
      } else {
        this.reportHTMLData = a;
        document.getElementById("content").innerHTML=`<object type="type/html" data="${this.reportHTMLData}" ></object>`
        this.isLoading = false;
      }
    });
  }

  selectFormat(formatType) {
    this.isLoading = true;
    this.submit(formatType)
  }

  submit(format) {
    const formatType = format ===  'PDF' ? 'pdf' : format === 'EXCEL' ? 'xlsx' : 'csv';
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
}
