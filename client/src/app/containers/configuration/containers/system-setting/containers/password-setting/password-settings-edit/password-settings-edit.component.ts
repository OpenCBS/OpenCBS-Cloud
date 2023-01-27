import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../../../../core/core.reducer';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FieldConfig } from '../../../../../../../shared/modules/cbs-form/models/field-config.interface';
import { Router } from '@angular/router';
import * as fromStore from '../../../../../../../core/store';
import { ISystemSettingState, UpdateSystemSettingState } from '../../../../../../../core/store';
import { CustomFieldSectionValue } from '../../../../../../../core/models';
import { environment } from '../../../../../../../../environments/environment';
import { Subscription } from 'rxjs/Rx';

const SVG_DATA = {collection: 'custom', class: 'custom77', name: 'custom77'};

@Component({
  selector: 'cbs-password-settings-edit',
  templateUrl: 'password-settings-edit.component.html',
  styleUrls: ['password-settings-edit.component.scss']
})

export class PasswordSettingsEditComponent implements OnInit, OnDestroy {
  public svgData = SVG_DATA;
  public settingsData: any;
  public passwordSettingForm: FormGroup;
  public isLoading = false;
  public formChanged = false;
  public settingsFieldSections: CustomFieldSectionValue[];
  public settingsFieldSection: any[];
  public updateState: any;
  public breadcrumb = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'SYSTEM_SETTINGS',
      link: '/configuration/system-settings'
    },
    {
      name: `PASSWORD_SETTINGS`,
      link: ''
    },
    {
      name: 'EDIT',
      link: ''
    }
  ];

  private isSubmitting = false;
  private cachedFormData: any[] = [];
  private fieldsSub: Subscription;
  private updateStateSub: Subscription;
  private systemSettingSub: Subscription;
  private formSub: Subscription;

  constructor(private store$: Store<fromRoot.State>,
              private systemSettingStateStore: Store<ISystemSettingState>,
              private translate: TranslateService,
              private router: Router,
              private toastrService: ToastrService,
              private updateSystemSettingStateStore: Store<UpdateSystemSettingState>,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.buildProfileForm();

    this.fieldsSub = this.store$.pipe(select(fromRoot.getSystemSettingState))
      .subscribe((response: any) => {
        if ( response.systemSetting.length ) {
          const fieldsArray = [];
          const fieldData = [];
          response.systemSetting.map(field => {
            if (field.customField.name !== 'DATE_FORMAT' && field.customField.name !== 'TIME_FORMAT' && field.customField.name !== 'NUMBER_FORMAT') {
              fieldData.push(field);
            }
          });
          fieldData.map(item => {
            const tempObj = {};
            if ( item['value'] ) {
              tempObj['value'] = item['value'] === 'TRUE' ? true : item['value'] === 'FALSE' ? false : item['value'];
            }

            let fieldMeta;
            if ( item['customField'] ) {
              fieldMeta = item['customField'];
            } else {
              fieldMeta = item;
            }

            for (const key in fieldMeta) {
              if ( fieldMeta.hasOwnProperty(key) ) {
                tempObj[key] = fieldMeta[key];
              }
            }

            fieldsArray.push(tempObj);
          });
          this.settingsData = fieldsArray;

          this.settingsFieldSection = [
            {
              caption: 'PASSWORD_SETTINGS_EDIT',
              id: 1,
              order: 1,
              values: this.settingsData
            }
          ];

          this.settingsFieldSections = this.settingsFieldSection;

          const sections = <FormArray>this.passwordSettingForm.controls['fieldSections'];

          if ( sections.length ) {
            sections.value.map(item => {
              sections.removeAt(sections.controls.indexOf(item));
            });
          }

          this.settingsFieldSection.map((section, index) => {
            sections.push(this.fb.array([]));
            this.generateCustomFields(section.values, index);
          });
        }
        this.isLoading = false;
      });

    this.updateStateSub = this.store$.pipe(select(fromRoot.getUpdateSystemSettingState))
      .subscribe((state: UpdateSystemSettingState) => {
        this.updateState = state;

        if ( state.loaded && state.success && !state.error ) {
          this.translate.get('UPDATE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });
          this.navigateBack();
        } else if ( state.loaded && !state.success && state.error ) {
          this.toastrService.error(state.errorMessage, '', environment.ERROR_TOAST_CONFIG);
          this.resetState();
        }
      });

    this.systemSettingSub = this.store$.pipe(select(fromRoot.getSystemSettingState))
      .subscribe((state: ISystemSettingState) => {
        if ( state.loaded && state.success && !state.error ) {
          if ( this.passwordSettingForm.value.fieldSections.length ) {
            this.cachedFormData = [];
            this.passwordSettingForm.value.fieldSections.map(section => {
              section.map(field => {
                const key = Object.keys(field)[0];
                if ( typeof field[key] === 'object' ) {
                  const obj = {};
                  obj[key] = field[key]['id'];
                  this.cachedFormData.push(obj);
                } else {
                  this.cachedFormData.push(field);
                }
              });
            });
          }
          if ( this.formSub ) {
            this.formSub.unsubscribe();
          }

          this.formSub = this.passwordSettingForm.valueChanges
            .subscribe(data => {
              this.formChanged = this.checkFormChanges(this.flattenArray(data.fieldSections), this.cachedFormData);
            });
        }
      });
  }

  buildProfileForm() {
    this.passwordSettingForm = this.fb.group({
      fieldSections: this.fb.array([])
    });
  }

  generateCustomFields(fields, index) {
    const section = <FormArray>this.passwordSettingForm.controls['fieldSections']['controls'][index];

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

    this.isLoading = false;
  }

  createControl(config: FieldConfig) {
    const {disabled, validation, value, required} = config;
    const validationOptions = validation || [];
    if ( required ) {
      validationOptions.push(Validators.required);
    }
    return this.fb.control({disabled, value}, validationOptions);
  }

  checkFormChanges(fields, cachedData) {
    let status = false;

    if ( fields && fields.length ) {
      fields.map(field => {
        const fieldKey = Object.keys(field)[0];
        cachedData.map((item) => {
          let itemKey = Object.keys(item)[0];
          if ( typeof item[itemKey] === 'object' ) {
            itemKey = item[itemKey]['name'];
          }
          if ( itemKey === fieldKey && field[fieldKey] !== item[itemKey] ) {
            status = true;
          }
        });
      });
    }

    return status;
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

  submitForm({valid, value}) {
    if ( valid ) {
      this.isSubmitting = true;
      const systemSettingDataToSend = [];
      const valueArray = this.flattenArray(value.fieldSections);
      const fieldsMeta = this.flattenArray(this.settingsFieldSections, 'values');

      fieldsMeta.map(field => {
        valueArray.map(valItem => {
          const key = Object.keys(valItem)[0];
          if ( key === field.name ) {
            systemSettingDataToSend.push({
              customField: {
                caption: field.caption,
                extra: field.extra,
                fieldType: field.fieldType,
                id: field.id,
                name: field.name,
                order: field.order,
                required: field.required,
                sectionId: field.sectionId,
                unique: field.unique
              },
              value: valItem[key] = valItem[key] === true ? 'TRUE' : valItem[key] === false ? 'FALSE' : valItem[key] ? valItem[key] : ''
            });
          }
        });
      });

      this.updateSystemSettingStateStore.dispatch(new fromStore.UpdateSystemSetting({
        data: systemSettingDataToSend
      }));
    }
  }

  navigateBack() {
    this.resetState();
    this.router.navigate(['/configuration/system-setting/containers/password-setting/password-settings/password']);
  }

  resetState() {
    this.updateSystemSettingStateStore.dispatch(new fromStore.UpdateSystemSettingReset());
    this.systemSettingStateStore.dispatch(new fromStore.LoadSystemSetting());
  }

  ngOnDestroy() {
    this.fieldsSub.unsubscribe();
    this.updateStateSub.unsubscribe();
    this.systemSettingSub.unsubscribe();
  }
}
