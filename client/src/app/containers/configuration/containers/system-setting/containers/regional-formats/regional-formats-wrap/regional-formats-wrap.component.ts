import { Component, OnInit } from '@angular/core';
import { NavElements } from '../shared/services/formats.service';
import { Router } from '@angular/router';
import * as fromStore from '../../../../../../../core/store';
import { select, Store } from '@ngrx/store';
import { AuthAppState, ISystemSettingState } from '../../../../../../../core/store';
import { CustomFieldSectionValue } from '../../../../../../../core/models';
import { Subscription } from 'rxjs/Rx';
import * as fromRoot from '../../../../../../../core/core.reducer';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FieldConfig } from '../../../../../../../shared/modules/cbs-form/models/field-config.interface';
import { UpdateSystemSettingState } from '../../../../../../../core/store';
import { ShareService } from '../shared/services/share.service';

const SVG_DATA = {collection: 'standard', class: 'event', name: 'event'};

@Component({
  selector: 'cbs-regional-formats-date',
  templateUrl: 'regional-formats-wrap.component.html',
  styleUrls: ['./regional-formats-wrap.component.scss']
})
export class RegionalFormatsWrapComponent implements OnInit {
  public svgData = SVG_DATA;
  public settingsFieldSections: CustomFieldSectionValue[];
  public settingsFieldSection: any[];
  public dateFormatSettingForm: FormGroup;
  public navElements = [];
  public settingsData: any;
  public breadcrumb = [];
  public opened = false;
  public sendData: any;

  private fieldsSub: Subscription;

  constructor(private navElement: NavElements,
              private router: Router,
              private store$: Store<fromRoot.State>,
              private authStore$: Store<AuthAppState>,
              private settingStateStore$: Store<ISystemSettingState>,
              private fb: FormBuilder,
              public shareService: ShareService,
              private updateSystemSettingStateStore: Store<UpdateSystemSettingState>,
              private systemSettingStore$: Store<ISystemSettingState>) {
  }

  ngOnInit() {
    this.dateFormatSettingForm = this.fb.group({
      fieldSections: this.fb.array([])
    });

    this.navElements = this.navElement.getNavConfig();

    this.systemSettingStore$.dispatch(new fromStore.LoadSystemSetting());
    this.fieldsSub = this.store$.pipe(select(fromRoot.getSystemSettingState))
      .subscribe((response: any) => {
        if ( response.systemSetting.length ) {
          this.breadcrumb = response.breadcrumb;
          const fieldsArray = [];
          const fieldData = response.systemSetting;
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

          const sections = <FormArray>this.dateFormatSettingForm.controls['fieldSections'];

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
      });
  }

  generateCustomFields(fields, index) {
    const section = <FormArray>this.dateFormatSettingForm.controls['fieldSections']['controls'][index];

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

  cancel() {
    this.router.navigate(['/configuration/system-settings']);
    this.shareService.clearData();
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

  closeModal() {
    this.opened = false;
  }

  openSubmitModal(value) {
    this.sendData = value;
    this.opened = true;
  }

  submitForm() {
    if ( this.sendData.valid ) {
      const systemSettingDataToSend = [];
      const valueArray = this.flattenArray(this.sendData.value.fieldSections);
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
              value: valItem[key] = valItem[key] === true
                ? 'TRUE' : valItem[key] === false
                  ? 'FALSE' : key === 'DATE_FORMAT' && this.shareService.getData('DATE_FORMAT')
                    ? this.shareService.getData('DATE_FORMAT') : key === 'TIME_FORMAT' && this.shareService.getData('TIME_FORMAT')
                      ? this.shareService.getData('TIME_FORMAT') : key === 'NUMBER_FORMAT' && this.shareService.getData('NUMBER_FORMAT')
                        ? this.shareService.getData('NUMBER_FORMAT') : valItem[key]
                          ? valItem[key] : ''
            });
          }
        });
      });

      this.shareService.clearData();
      this.updateSystemSettingStateStore.dispatch(new fromStore.UpdateSystemSetting({
        data: systemSettingDataToSend
      }));
    }

    this.authStore$.dispatch(new fromStore.PurgeAuth());
    this.router.navigate(['/login']);
  }
}
