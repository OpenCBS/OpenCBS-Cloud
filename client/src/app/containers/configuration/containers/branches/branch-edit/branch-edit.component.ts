import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../../environments/environment';
import { BranchInfoActions, IBranchInfo } from '../../../../../core/store/branches/branch-info';
import { BranchUpdateActions, IUpdateBranch } from '../../../../../core/store/branches/branch-edit';
import * as fromRoot from '../../../../../core/core.reducer';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomFieldSectionValue } from '../../../../../core/models';
import * as _ from 'lodash';
import { FieldConfig } from '../../../../../shared/modules/cbs-form/models/field-config.interface';
import { Subscription } from 'rxjs';
import { cloneDeep } from 'lodash'

const SVG_DATA = {collection: 'standard', class: 'hierarchy', name: 'hierarchy'};

@Component({
  selector: 'cbs-branch-edit',
  templateUrl: 'branch-edit.component.html',
  styleUrls: ['branch-edit.component.scss']
})

export class BranchEditComponent implements OnInit, OnDestroy, AfterViewInit {
  public formChanged = false;
  public form: FormGroup;
  public branchId: number;
  public breadcrumbLinks = [];
  public branchCustomFields: CustomFieldSectionValue[];
  public customFields = [];
  public svgData = SVG_DATA;
  public isOpen = false;
  public branchName: string;

  private isSubmitting = false;
  private isLeaving = false;
  private cachedData: any;
  private nextRoute: string;
  public branchUpdateSub: Subscription;
  public infoSub: Subscription;
  private routeSub: Subscription;

  constructor(private route: ActivatedRoute,
              private branchInfoStore$: Store<IBranchInfo>,
              private branchInfoActions: BranchInfoActions,
              private branchUpdateActions: BranchUpdateActions,
              private branchUpdateStore$: Store<IUpdateBranch>,
              private fb: FormBuilder,
              private store$: Store<fromRoot.State>,
              private toastrService: ToastrService,
              private router: Router,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: new FormControl('', Validators.required),
      fieldSections: this.fb.array([])
    });

    this.branchUpdateSub = this.store$.pipe(select(fromRoot.getBranchUpdateState))
      .subscribe((branchUpdate: IUpdateBranch) => {
        if ( branchUpdate.loaded && branchUpdate.success && !branchUpdate.error ) {
          this.branchInfoStore$.dispatch(this.branchInfoActions.fireInitialAction(branchUpdate['data']['id']));
          this.translate.get('UPDATE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });
          this.resetState();
          this.router.navigate(['/configuration', 'branches', 'info', this.branchId]);
        } else if ( branchUpdate.loaded && !branchUpdate.success && branchUpdate.error ) {
          this.translate.get('UPDATE_ERROR').subscribe((res: string) => {
            this.toastrService.error(branchUpdate.errorMessage, res, environment.ERROR_TOAST_CONFIG);
          });
          this.resetState();
        }
      });

    this.infoSub = this.branchInfoStore$.pipe(select(fromRoot.getBranchInfoState))
      .subscribe((branch: IBranchInfo) => {
        if ( branch.loaded && branch.success && !branch.error ) {
          this.branchName = branch['data']['name'];
          this.form.controls['name'].setValue(this.branchName);
          this.cachedData = Object.assign({}, branch['data']);

          this.branchCustomFields = branch.data.customFieldSections;
          this.customFields = _.map(branch.data.customFieldSections, (section: any) => {
            return {
              ...section,
              values: _.map(section.values, (field: any) => {
                const newField = cloneDeep(field);
                if ( field.customField['fieldType'] === 'LOOKUP' && field.customField['extra'] && field.customField['extra']['key'] ) {
                  newField.customField['extra']['url'] = `${environment.API_ENDPOINT}${field.customField['extra']['key']}/lookup`;
                }
                return {
                  ...newField.customField,
                  value: newField.value
                }
              })
            }
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
        }
      });


    this.routeSub = this.route.params.subscribe(params => {
      this.branchId = params['id'];
      this.breadcrumbLinks = [
        {
          name: 'BRANCHES',
          link: '/configuration/branches'
        },
        {
          name: this.branchName,
          link: '/configuration/branches'
        },
        {
          name: 'EDIT',
          link: ''
        }
      ];
      this.loadBranchInfo()
    });
  }

  canDeactivate(url?) {
    this.nextRoute = url;
    if ( this.formChanged && !this.isSubmitting ) {
      this.isOpen = true;
      return this.isLeaving;
    } else {
      return true;
    }
  }

  ngAfterViewInit() {
    this.form.valueChanges.subscribe(data => {
      this.formChanged = this.checkFormChanges(data);
    });
  }

  goToNextRoute() {
    this.isLeaving = true;
    this.router.navigateByUrl(this.nextRoute);
  }

  closeConfirmPopup() {
    this.isOpen = false;
  }

  resetState() {
    this.branchUpdateStore$.dispatch(this.branchUpdateActions.fireResetAction());
  }

  loadBranchInfo() {
    this.branchInfoStore$.dispatch(this.branchInfoActions.fireInitialAction(this.branchId));
  }

  saveChanges({valid, value}) {
    if ( valid ) {
      this.isSubmitting = true;
      const branchDataToSend = {
        fieldValues: []
      };
      const valueArray = this.flattenArray(value.fieldSections);
      const fieldsMeta = this.flattenArray(this.branchCustomFields, 'values');

      fieldsMeta.map(field => {
        valueArray.map(valItem => {
          const key = Object.keys(valItem)[0];
          if ( key === field.customField.name ) {
            branchDataToSend.fieldValues.push({
              fieldId: field.customField.id,
              value: valItem[key] ? valItem[key] : ''
            });
          }
        });
      });

      const sendToFields = {
        name: value.name,
        fieldValues: branchDataToSend.fieldValues
      };

      this.branchUpdateStore$.dispatch(this.branchUpdateActions.fireInitialAction({
        branch: sendToFields,
        id: this.branchId
      }))
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

  checkFormChanges(fields) {
    let status = false;
    for (const key in fields) {
      if ( this.cachedData && this.cachedData.hasOwnProperty(key) ) {
        if ( key === 'location' && this.cachedData['location'] ) {
          if ( fields[key] !== this.cachedData['location']['id'] ) {
            status = true;
          }
        } else if ( this.cachedData[key] !== fields[key] ) {
          status = true;
        }
      }
    }

    const fieldValues = fields.fieldSections;
    if ( fieldValues && fieldValues.length ) {
      fieldValues.map(field => {
        const fieldKey = Object.keys(field)[0];
        this.cachedData.customFieldSections.map((item) => {
          let itemKey = Object.keys(item.values)[0];
          if ( typeof item[itemKey] === 'object' ) {
            itemKey = item[itemKey]['name'];
          }
          if ( itemKey === fieldKey && field[fieldKey] !== item.values[itemKey] ) {
            status = true;
          }
        });
      });
    }

    return status;
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
    this.branchUpdateSub.unsubscribe();
    this.infoSub.unsubscribe();
    this.routeSub.unsubscribe();
  }
}
