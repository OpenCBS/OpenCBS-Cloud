import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { environment } from '../../../../../environments/environment';
import * as _ from 'lodash';
import * as fromRoot from '../../../../core/core.reducer';
import {
  ILoanAppState,
} from '../../../../core/store/loan-application';
import { LoanAppSubmitService } from '../../shared/services/loan-app-submit.service';
import { LoanAppStatus } from '../../../../core/loan-application-status.enum';
import { LoanAppCustomFieldsService } from '../../../../core/store/loan-application/loan-app-custom-fields.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FieldConfig } from '../../../../shared/modules/cbs-form/models/field-config.interface';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CustomFieldSectionValue } from '../../../../core/models/customField.model';
import { Subscription } from 'rxjs';

const SVG_DATA = {collection: 'custom', class: 'custom41', name: 'custom41'};

@Component({
  selector: 'cbs-loan-application-custom-field-add',
  templateUrl: './loan-application-custom-field-edit.component.html',
  styleUrls: ['./loan-application-custom-field-edit.component.scss']
})
export class LoanApplicationCustomFieldEditComponent implements OnInit, OnDestroy {
  public breadcrumbLinks = [];
  public svgData = SVG_DATA;
  public loanAppStatus: string;
  public loanAppStatusEnum = LoanAppStatus;
  public loanApplicationState: ILoanAppState;
  public loanApplication: any;
  public url = '';
  public loanAppId: number;
  public text: string;
  public opened = false;
  public submitService = this.loanAppSubmitService;
  public customFields = [];
  public sectionNavData: any = [];
  public activeSectionId = 1;
  public loanAppCustomFields: CustomFieldSectionValue[];
  public form: FormGroup;

  private loanApplicationSub: Subscription;

  constructor(private loanApplicationStore$: Store<ILoanAppState>,
              private loanAppSubmitService: LoanAppSubmitService,
              private fb: FormBuilder,
              private translate: TranslateService,
              private toastrService: ToastrService,
              private router: Router,
              private loanAppCustomFieldService: LoanAppCustomFieldsService) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      fieldSections: this.fb.array([])
    });

    this.loanApplicationSub = this.loanApplicationStore$.pipe(select(fromRoot.getLoanApplicationState))
      .subscribe((loanAppState: ILoanAppState) => {
        this.loanApplicationState = loanAppState;
        this.loanApplication = loanAppState.loanApplication;
        this.loanAppStatus = loanAppState.loanApplication['status'];
        if ( loanAppState.success && loanAppState.loaded && loanAppState.loanApplication ) {
          this.loanAppId = loanAppState.loanApplication['id'];
          const loanProfile = loanAppState.loanApplication['profile'];
          const profileType = loanProfile['type'] === 'PERSON' ? 'people' : loanProfile['type'] === 'COMPANY' ? 'companies' : 'groups';
          this.breadcrumbLinks = [
            {
              name: loanProfile['name'],
              link: `/profiles/${profileType}/${loanProfile['id']}/info`
            },
            {
              name: 'LOAN_APPLICATIONS',
              link: '/loan-applications'
            },
            {
              name: loanAppState.loanApplication['code'],
              link: ''
            },
            {
              name: 'ADDITIONAL_INFORMATION',
              link: ''
            }
          ];

          this.url = `${environment.API_ENDPOINT}loan-applications/${this.loanAppId}/attachments`;

          this.loanAppCustomFieldService.getCustomFields(this.loanAppId)
            .subscribe(fields => {
              this.loanAppCustomFields = fields;
              this.customFields = _.map(fields, (section: any) => {
                return {
                  ...section,
                  values: _.map(section.values, (field: any) => {
                    if ( field.customField['fieldType'] === 'LOOKUP' && field.customField['extra'] && field.customField['extra']['key'] ) {
                      field.customField['extra']['url'] = `${environment.API_ENDPOINT}${field.customField['extra']['key']}/lookup`;
                    }
                    return {
                      ...field.customField,
                      value: field.value
                    }
                  })
                }
              });

              fields.map(section => {
                this.sectionNavData.push({
                  title: section.caption,
                  id: section.id
                });
              });

              const sections = <FormArray>this.form.controls['fieldSections'];

              if ( sections.length ) {
                sections.value.map(item => {
                  sections.removeAt(sections.controls.indexOf(item));
                });
              }

              this.customFields.map((section, index) => {
                sections.push(this.fb.array([]));
                this.generateCustomFields(section.values, index);
              });
            });
        }
      });
  }

  informVisibleBlock(sectionEl: HTMLElement) {
    const section = sectionEl.id;

    this.activeSectionId = +section.split('_')[1];
  }

  submitForm({valid, value}) {
    if ( valid ) {
      const dataToSend = {
        fieldValues: []
      };
      const valueArray = this.flattenArray(value.fieldSections);
      const fieldsMeta = this.flattenArray(this.customFields, 'values');

      fieldsMeta.map(field => {
        valueArray.map(valItem => {
          const key = Object.keys(valItem)[0];
          if ( key === field.name ) {
            dataToSend.fieldValues.push({
              fieldId: field.id,
              value: valItem[key] ? valItem[key] : ''
            });
          }
        });
      });
      this.loanAppCustomFieldService.updateCustomFields(this.loanAppId, dataToSend)
        .subscribe(res => {
          if ( res.error ) {
            this.toastrService.clear();
            this.toastrService.error(res.message ? res.message : 'ERROR', '', environment.ERROR_TOAST_CONFIG);
          } else {
            this.toastrService.clear();
            this.translate.get('UPDATE_SUCCESS').subscribe((message: string) => {
              this.toastrService.success(message, '', environment.SUCCESS_TOAST_CONFIG);
            });
            this.router.navigate(['loan-applications', this.loanAppId, 'custom-fields']);
          }
        });
    }
  }

  // TODO(chyngyz): Change to lodash implementation
  flattenArray(array, selector?) {
    let tempArray = [];
    array.map(item => {
      if ( Array.isArray(item) ) {
        tempArray = [...tempArray, ...item];
      }
      if ( selector && !Array.isArray(item) ) {
        tempArray = [...tempArray, ...item[selector]];
      }
    });
    return tempArray;
  }

  generateCustomFields(fields, index) {
    const section = <FormArray>this.form.controls['fieldSections']['controls'][index];

    if ( section.length ) {
      section.value.map(item => {
        section.removeAt(section.controls.indexOf(item));
      });
    }

    fields.map(item => {
      const group = this.fb.group({});
      group.addControl(item.name, this.createControl(item));
      section.push(group);
    });
  }

  createControl(config: FieldConfig) {
    const {disabled, validation, value, required} = config;
    const validationOptions = validation || [];
    if ( required ) {
      validationOptions.push(Validators.required);
    }
    return this.fb.control({disabled, value}, validationOptions);
  }

  ngOnDestroy() {
    this.loanApplicationSub.unsubscribe();
  }
}
