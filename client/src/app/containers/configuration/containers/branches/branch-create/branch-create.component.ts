import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { BranchCreateActions } from '../../../../../core/store/branches/branch-create/branch-create.actions';
import { IBranch } from '../../../../../core/store/branches/branch-create/branch-create.reducer';
import { environment } from '../../../../../../environments/environment';
import * as fromRoot from '../../../../../core/core.reducer';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomFieldSectionMeta } from '../../../../../core/models';
import { FieldConfig } from '../../../../../shared/modules/cbs-form/models/field-config.interface';
import { BranchFieldsState } from '../../../../../core/store/branches/branch-fields';
import * as fromStore from '../../../../../core/store';
import * as _ from 'lodash';
import { cloneDeep } from 'lodash';
import { Subscription } from 'rxjs';

const SVG_DATA = {collection: 'standard', class: 'hierarchy', name: 'hierarchy'};

@Component({
  selector: 'cbs-branch-new',
  templateUrl: 'branch-create.component.html',
  styleUrls: ['branch-create.component.scss']
})

export class BranchCreateComponent implements OnInit, OnDestroy {
  public svgData = SVG_DATA;
  public form: FormGroup;
  public branchCustomFields: CustomFieldSectionMeta[] = [];
  public customFields = [];
  public breadcrumbLinks = [
    {
      name: 'BRANCHES',
      link: '/configuration/branches'
    },
    {
      name: 'CREATE',
      link: ''
    }
  ];
  public branchFieldsStore: any;
  public loading = true;

  private branchCreateSub: Subscription;
  private branchFieldsSub: Subscription;

  constructor(private router: Router,
              private store$: Store<fromRoot.State>,
              private fb: FormBuilder,
              private branchFieldsStateStore$: Store<BranchFieldsState>,
              private branchCreateStore$: Store<IBranch>,
              private branchCreateActions: BranchCreateActions,
              private toastrService: ToastrService,
              private translate: TranslateService) {
    this.branchFieldsStore = this.store$.pipe(select(fromRoot.getBranchFieldsState));
  }

  ngOnInit() {
    this.buildProfileForm();
    this.branchFieldsStateStore$.dispatch(new fromStore.LoadBranchFieldsMeta());
    this.branchCreateSub = this.store$.pipe(select(fromRoot.getBranchCreateState))
      .subscribe((branch: IBranch) => {
        if ( branch.loaded && branch.success && !branch.error ) {
          this.translate.get('CREATE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });
          this.router.navigate(['/configuration', 'branches', 'info', branch['data']['id']]);
          this.resetState();
        } else if ( branch.loaded && !branch.success && branch.error ) {
          this.translate.get('CREATE_ERROR').subscribe((res: string) => {
            this.toastrService.error(branch.errorMessage, res, environment.ERROR_TOAST_CONFIG);
          });
          this.resetState();
        }
      });

    this.branchFieldsSub = this.store$.pipe(select(fromRoot.getBranchFieldsState))
      .subscribe((fields: any) => {
        this.branchCustomFields = fields.branchFields;

        this.customFields = _.map(fields.branchFields, (section: any) => {
          return {
            ...section,
            values: _.map(section.customFields, (field: any) => {
              const newField = cloneDeep(field);
              if ( field['fieldType'] === 'LOOKUP' && field['extra'] && field['extra']['key'] ) {
                newField['extra']['url'] = `${environment.API_ENDPOINT}${field['extra']['key']}/lookup`;
              }
              return {
                ...newField,
                value: newField.value
              }
            })
          }
        });

        this.generateSections(this.branchCustomFields);
      });
  }

  buildProfileForm() {
    this.form = this.fb.group({
      name: new FormControl('', Validators.required),
      fieldSections: this.fb.array([])
    });
  }

  generateSections(sectionsMeta) {
    if ( sectionsMeta.length ) {
      const sections = <FormArray>this.form.controls['fieldSections'];

      if ( sections.length ) {
        sections.value.map(item => {
          sections.removeAt(sections.controls.indexOf(item));
        });
      }

      sectionsMeta.map((section, index) => {
        sections.push(this.fb.array([]));
        this.generateCustomFields(section.customFields, index);
      });
      this.loading = false;
    }
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

  resetState() {
    this.branchCreateStore$.dispatch(this.branchCreateActions.fireResetAction());
  }

  ngOnDestroy() {
    this.branchCreateSub.unsubscribe();
  }

  goToViewCCRules() {
    this.router.navigate(['/configuration', 'branches']);
  }

  submitForm({valid, value}) {
    if ( valid ) {
      const branchDataToSend = {
        fieldValues: []
      };
      const valueArray = this.flattenArray(value.fieldSections);
      const fieldsMeta = this.flattenArray(this.branchCustomFields, 'customFields');

      fieldsMeta.map(field => {
        valueArray.map(valItem => {
          const key = Object.keys(valItem)[0];
          if ( key === field.name ) {
            branchDataToSend.fieldValues.push({
              fieldId: field.id,
              value: valItem[key] ? valItem[key] : null
            });
          }
        });
      });

      const sendToFields = {
        name: value.name,
        fieldValues: branchDataToSend.fieldValues
      };

      this.branchCreateStore$.dispatch(this.branchCreateActions.fireInitialAction(sendToFields));
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

  createControl(config: FieldConfig) {
    const {disabled, validation, value, required} = config;
    const validationOptions = validation || [];
    if ( required ) {
      validationOptions.push(Validators.required);
    }
    return this.fb.control({disabled, value}, validationOptions);
  }
}
