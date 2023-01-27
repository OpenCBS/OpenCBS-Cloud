import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { environment } from '../../../../../environments/environment';
import * as _ from 'lodash';
import * as fromRoot from '../../../../core/core.reducer';
import { LoanAppCustomFieldsService } from '../../../../core/store/loan-application/loan-app-custom-fields.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FieldConfig } from '../../../../shared/modules/cbs-form/models/field-config.interface';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CustomFieldSectionValue } from '../../../../core/models/customField.model';
import { Subscription } from 'rxjs';
import { ILoanInfo } from '../../../../core/store/loans/loan';

const SVG_DATA = {collection: 'custom', class: 'custom41', name: 'custom41'};

@Component({
  selector: 'cbs-loan-application-custom-field-add',
  templateUrl: './loan-custom-fields-edit.component.html',
  styleUrls: ['./loan-custom-fields-edit.component.scss']
})
export class LoanCustomFieldsEditComponent implements OnInit, OnDestroy {
  public breadcrumbLinks = [];
  public isOpen = false;
  public svgData = SVG_DATA;
  public loanStatus: string;
  public loan: any;
  public profileType: string;
  public loanAppId: number;
  public loanId: number;
  public customFields = [];
  private isLeaving = false;
  private nextRoute: string;
  private isSubmitting = false;
  public sectionNavData: any = [];
  public activeSectionId = 1;
  public loanCustomFields: CustomFieldSectionValue[];
  public form: FormGroup;

  private loanSub: Subscription;

  constructor(private loanStore$: Store<ILoanInfo>,
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

    this.loanSub = this.loanStore$.pipe(select(fromRoot.getLoanInfoState))
      .subscribe(loan => {
        if ( loan['loaded'] && !loan['error'] && loan['success'] ) {
          this.loan = loan.loan;
          this.loanId = this.loan.id;
          this.loanStatus = this.loan.status;
          const loanProfile = this.loan.profile;
          this.profileType = loanProfile.type;
          const profileType = loanProfile.type === 'PERSON' ? 'people' : 'companies';
          this.loanAppId = this.loan.loanApplicationId;
          this.breadcrumbLinks = [
            {
              name: loanProfile.name,
              link: `/profiles/${profileType}/${loanProfile.id}/info`
            },
            {
              name: 'LOANS',
              link: '/loans'
            },
            {
              name: this.loan['code'],
              link: ''
            },
            {
              name: 'ADDITIONAL_INFORMATION_EDIT',
              link: ''
            }
          ];

          this.loanAppCustomFieldService.getCustomFields(this.loanAppId)
            .subscribe(fields => {
              this.loanCustomFields = fields;
              this.customFields = _.map(fields, (section: any) => {
                return {
                  ...section,
                  values: _.map(section.values, (field: any) => {
                    if ( field.customField.fieldType === 'LOOKUP' && field.customField.extra && field.customField.extra.key ) {
                      field.customField.extra.url = `${environment.API_ENDPOINT}${field.customField.extra.key}/lookup`;
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
            this.isSubmitting = true;
            this.toastrService.clear();
            this.translate.get('UPDATE_SUCCESS').subscribe((message: string) => {
              this.toastrService.success(message, '', environment.SUCCESS_TOAST_CONFIG);
            });
            this.router.navigate([`loans/${this.loanId}/${this.profileType.toLowerCase()}/custom-fields`]);
          }
        });
    }
  }

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
    this.loanSub.unsubscribe();
  }
}
