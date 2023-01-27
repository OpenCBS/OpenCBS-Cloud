import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReportService } from '../shared/reports.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { FieldConfig } from '../../../shared/modules/cbs-form/models/field-config.interface';
import * as FileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { ShareService } from '../shared/share.service';

const SVG_DATA = {
  collection: 'standard',
  class: 'timesheet',
  name: 'timesheet'
};

@Component({
  selector: 'cbs-report-list',
  templateUrl: 'report-list.component.html',
  styleUrls: ['report-list.component.scss']
})

export class ReportListComponent implements OnInit, OnDestroy {
  public searchQuery = '';
  public isOpen = false;
  public reportForm: FormGroup;
  public customFields = [];
  public fieldsReady = true;
  public isLoading = false;
  public currentReport: any;
  public reportName: string;
  public svgData = SVG_DATA;
  public reports: any;

  private reportsData: any;

  constructor(private fb: FormBuilder,
              private reportService: ReportService,
              public toastrService: ToastrService,
              private router: Router,
              public shareService: ShareService,
              public translate: TranslateService) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.reportForm = this.fb.group({
      fieldValues: this.fb.array([])
    });

    this.reportsData = this.reportService.getReportList().subscribe(response => {
      this.reports = response;
      this.isLoading = false;
    });
  }

  cancel() {
    this.isOpen = false;
  }

  openModal(report) {
    this.reportName = report['label'];
    this.currentReport = report;
    this.fieldsReady = true;
    this.generateCustomFields(report['fields']);
    this.isOpen = true;
  }

  generateCustomFields(fieldsArray) {
    const fields = this.reportForm.controls['fieldValues'] as FormArray;
    if ( fields.length ) {
      fields.value.map(field => {
        fields.removeAt(fields.controls.indexOf(field));
      });
    }

    fieldsArray.map(el => {
      if ( el.caption === 'Accounts' ) {
        if ( el['fieldType'] === 'LOOKUP' && el['extra'] && el['extra']['key'] ) {
          el['extra']['url'] = `${environment.API_ENDPOINT}${el['extra']['key']}/lookup`;
          el['extra']['code'] = true
        }
      } else {
        if ( el['fieldType'] === 'LOOKUP' && el['extra'] && el['extra']['key'] ) {
          el['extra']['url'] = `${environment.API_ENDPOINT}${el['extra']['key']}/lookup`;
        }
      }
      return el;
    }).map(item => {
      const group = this.fb.group({});
      group.addControl(item.name, this.createControl(item));
      fields.push(group);
    });

    this.customFields = fieldsArray;
    this.fieldsReady = false;
  }

  createControl(config: FieldConfig) {
    const newDate = new Date();
    const firstDay = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
    if ( config.name === 'startDate' ) {
      if ( config.defaultValue === null ) {
        config.value = moment(firstDay).format('YYYY-MM-DDTHH:mm:ss');
      } else {
        config.value = moment(config.defaultValue).format('YYYY-MM-DDTHH:mm:ss');
      }
    }
    if ( config.name === 'endDate' || config.name === 'ddate' ) {
      config.value = moment(newDate).format('YYYY-MM-DDTHH:mm:ss');
    }

    const {disabled, validation, value, required} = config;
    const validationOptions = validation || [];
    if ( required ) {
      validationOptions.push(Validators.required);
    }
    return this.fb.control({disabled, value}, validationOptions);
  }

  submit() {
    this.isOpen = false;
    this.isLoading = true;
    const objToSend = {
      templateId: this.currentReport['id'],
      reportName: this.currentReport['name'],
      fieldsValues: {}
    };
    this.reportForm.value.fieldValues.map((field: Object) => {
      this.customFields.map(item => {
        if ( field.hasOwnProperty(item.name) ) {
          objToSend.fieldsValues[item.name] = field[item.name];
        }
      });
    });
    if ( this.currentReport.loaderType === 'JASPER_LOADER') {
      const newObjToSend = {
        ...objToSend,
        reportLabel: this.currentReport['label'],
        fieldsValues : {
          ...objToSend.fieldsValues,
          format: 'HTML'
        }
      };
      this.shareService.setData(newObjToSend);
      this.router.navigateByUrl('report');
    } else {
      const date = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
      this.reportService.getFileExcel(objToSend).subscribe((a: any) => {
        if ( a['err'] ) {
          this.translate.get('CREATE_ERROR').subscribe((res: string) => {
            this.toastrService.error(a['err'], res, environment.ERROR_TOAST_CONFIG);
          });
        } else {
          FileSaver.saveAs(a, `${this.currentReport['label']} ${date}.xlsx`)
        }
        this.isLoading = false;
      });
    }
  }

  ngOnDestroy() {
    this.reportsData.unsubscribe();
  }
}
