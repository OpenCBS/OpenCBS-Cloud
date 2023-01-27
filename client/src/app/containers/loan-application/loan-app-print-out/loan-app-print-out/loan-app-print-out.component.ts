import { Component, OnInit } from '@angular/core';
import { ILoanAppState } from '../../../../core/store/loan-application/loan-application/loan-application.reducer';
import { Store } from '@ngrx/store';
import * as FileSaver from 'file-saver';
import { PrintOutService } from '../../../../core/services/print-out.service';
import { environment } from '../../../../../environments/environment.prod';
import { ToastrService } from 'ngx-toastr';
import * as fromRoot from '../../../../core/core.reducer';
import * as fromStore from '../../../../core/store';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FieldConfig } from '../../../../shared/modules/cbs-form/models/field-config.interface';
import * as moment from 'moment';
import { ILoanAppFormState } from '../../../../core/store/loan-application/loan-application-form/loan-application-form.interfaces';
import { Subscription } from 'rxjs';
import { ShareService } from '../../../reports/shared/share.service';
import { Router } from '@angular/router';

@Component({
  selector: 'cbs-loan-app-print-out',
  templateUrl: 'loan-app-print-out.component.html',
  styleUrls: ['loan-app-print-out.component.scss']
})

export class LoanAppPrintOutComponent implements OnInit {
  public forms = [];
  public reportName: string;
  public currentReport: any;
  public defaultField: any;
  public reportForm: FormGroup;
  public isOpen = false;
  public breadcrumb = [];
  public customFields = [];
  public fieldsReady = true;

  private loanAppId: number;
  private loanApplicationSub: Subscription;

  constructor(private loanApplicationStore$: Store<ILoanAppState>,
              private toastrService: ToastrService,
              public shareService: ShareService,
              private router: Router,
              private loanAppFormStore$: Store<ILoanAppFormState>,
              private fb: FormBuilder,
              private printOutService: PrintOutService) {
  }

  ngOnInit() {
    this.printOutService.getForms('LOAN_APPLICATION').subscribe((forms) => {
      if ( !forms.err ) {
        this.forms = forms;
        this.printOutService.getExcelForms('LOAN_APPLICATION').subscribe(a => {
          this.forms = this.forms.concat(a);
        });
      }
    });

    this.reportForm = this.fb.group({
      fieldValues: this.fb.array([])
    });

    this.loanApplicationSub = this.loanApplicationStore$.select(fromRoot.getLoanApplicationState).subscribe(
      (loanAppState: ILoanAppState) => {
        if ( loanAppState.loaded && loanAppState.success ) {
          this.loanAppId = loanAppState['loanApplication']['id'];
          const profile = loanAppState['loanApplication']['profile'];
          const profileType = profile['type'] === 'PERSON' ? 'people' : 'companies';
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
              name: loanAppState['loanApplication']['code'],
              link: ''
            },
            {
              name: 'PRINT OUT',
              link: ''
            }
          ];
        }
      });

    setTimeout(() => {
      this.loanAppFormStore$.dispatch(new fromStore.SetBreadcrumb(this.breadcrumb));
    }, 1000);
  }


  downLoad(doc) {
    const objToSendJasperReport = {
      templateId: doc['id'],
      reportName: doc['name'],
      fieldsValues: {}
    };

    if ( doc.loaderType === 'JASPER_LOADER' ) {
      const newObjToSend = {
        ...objToSendJasperReport,
        reportLabel: doc['label'],
        fieldsValues: {
          ...objToSendJasperReport.fieldsValues,
          loanApplicationId: this.loanAppId,
          format: 'HTML'
        }
      };
      this.shareService.setData(newObjToSend);
      this.router.navigateByUrl(`loan-applications/${this.loanAppId}/print-out-preview`);
    } else {
      this.reportName = doc['label'];
      this.currentReport = doc;
      if ( doc.fields ) {
        if ( doc.fields.length ) {
          doc.fields.map((field, i) => {
            if ( field['extra']['default'] ) {
              this.defaultField = field;
              doc.fields.splice(i, 1);
            }
          })
        }
        const objToSend = {
          fieldsValues: {}
        };
        objToSend['fieldsValues'][this.defaultField['name']] = this.loanAppId;
        objToSend['entityId'] = this.loanAppId;
        objToSend['templateId'] = doc['id'];
        if ( doc.fields.length ) {
          this.generateCustomFields(doc['fields']);
          this.isOpen = true;
        } else {
          this.printOutService.downloadExcelForm(objToSend).subscribe(res => {
            this.isOpen = false;
            if ( res.err ) {
              this.toastrService.error(res.err, '', environment.ERROR_TOAST_CONFIG);
            } else {
              FileSaver.saveAs(res, `${doc['label']}.xlsx`);
            }
          });
        }
      } else {
        const objToSend = {
          entityId: this.loanAppId,
          templateId: doc['id']
        };
        const formType = doc.loaderType === 'EXCEL_LOADER' ? 'excel' : 'word'
        this.printOutService.downloadMicrosoftDocForm(objToSend, formType)
          .subscribe(res => {
            if ( res.errorCode ) {
              this.toastrService.error(res.message, 'ERROR', environment.ERROR_TOAST_CONFIG);
            } else {
              const formatType = doc.loaderType === 'EXCEL_LOADER' ? 'xlsx' : 'docx'
              FileSaver.saveAs(res, `${doc['label']}.${formatType}`);
            }
          })
      }
    }
  }

  generateCustomFields(fieldsArray) {
    const fields = <FormArray> this.reportForm.controls['fieldValues'];
    if ( fields.length ) {
      fields.value.map(field => {
        fields.removeAt(fields.controls.indexOf(field));
      });
    }

    fieldsArray.map(el => {
      if ( el['fieldType'] === 'LOOKUP' && el['extra'] && el['extra']['key'] ) {
        el['extra']['url'] = `${environment.API_ENDPOINT}${el['extra']['key']}/lookup`;
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
      config.value = moment(firstDay).format('YYYY-MM-DDTHH:mm:ss');
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
    const objToSend = {
      templateId: this.currentReport['id'],
      fieldsValues: {}
    };
    this.reportForm.value.fieldValues.map((field: Object) => {
      this.customFields.map(item => {
        if ( field.hasOwnProperty(item.name) ) {
          objToSend.fieldsValues[item.name] = field[item.name];
        }
      });
    });
    if ( this.defaultField ) {
      objToSend['fieldsValues'][this.defaultField['name']] = this.loanAppId;
    }
    this.printOutService.downloadExcelForm(objToSend).subscribe(res => {
      if ( res.err ) {
        this.toastrService.error(res.err, '', environment.ERROR_TOAST_CONFIG);
      } else {
        FileSaver.saveAs(res, `${this.currentReport['label']}.xlsx`);
      }
    });
  }

  cancel() {
    this.isOpen = false;
  }
}
