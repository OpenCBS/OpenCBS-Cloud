import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CollateralTypeListState } from '../../../../../core/store/collateral-type';
import { environment } from '../../../../../../environments/environment';
import { FieldConfig } from '../../../../../shared/modules/cbs-form/models/field-config.interface';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';


@Component({
  selector: 'cbs-loan-app-collateral-form',
  templateUrl: 'loan-app-collateral-form.component.html',
  styleUrls: ['loan-app-collateral-form.component.scss']
})
export class LoanAppCollateralFormComponent implements OnInit, OnDestroy {
  public collateralForm: FormGroup;
  public collateralTypeState: CollateralTypeListState;
  public customFields: FieldConfig[];

  private collateralTypesSub: any;

  constructor(private fb: FormBuilder,
              private store$: Store<fromRoot.State>,
              private collateralTypesStore$: Store<CollateralTypeListState>) {
  }

  ngOnInit() {
    this.collateralForm = this.fb.group({
      name: this.fb.control('', Validators.required),
      amount: this.fb.control('', Validators.required),
      typeOfCollateralId: this.fb.control('', Validators.required),
      fieldValues: this.fb.array([])
    });

    this.collateralTypesSub = this.store$.select(fromRoot.getCollateralTypeListState).subscribe(
      (state: CollateralTypeListState) => {
        if (state.loaded && state.success) {
          this.collateralTypeState = state;
          if (state.collateralTypes.length) {
            const selectedCollateralTypeId = state.collateralTypes[0]['id'];
            this.getFields(selectedCollateralTypeId);
            this.collateralForm.controls['typeOfCollateralId'].setValue(selectedCollateralTypeId);
          }
        } else if (!state.loaded && !state.loading && !state.success) {
          this.collateralTypesStore$.dispatch(new fromStore.LoadCollateralTypes());
        }
      }
    );
  }

  ngOnDestroy() {
    this.collateralTypesSub.unsubscribe();
  }


  getFields(typeId: number) {
    if (this.collateralTypeState.collateralTypes.length) {
      this.collateralTypeState.collateralTypes.map(type => {
        if (type.id === +typeId) {
          this.generateCustomFields(type.customFields);
        }
      });
    }
  }

  generateCustomFields(fieldsArray) {
    const cusFields = [];
    const fields = <FormArray>this.collateralForm.controls['fieldValues'];
    if (fields.length) {
      fields.value.map(field => {
        fields.removeAt(fields.controls.indexOf(field));
      });
    }

    fieldsArray.map(element => {
      const el = Object.assign({}, element);
      if (el['fieldType'] === 'LOOKUP' && el['extra'] && el['extra']['key']) {
        el['extra'] = Object.assign({}, el['extra'], {
          url: `${environment.API_ENDPOINT}${el['extra']['key']}/lookup`
        });
      }
      return el;
    }).map(item => {
      const group = this.fb.group({});
      group.addControl(item.name, this.createControl(item));
      fields.push(group);
      cusFields.push(item);
    });
    this.customFields = cusFields;
  }

  populateFields(data) {
    this.collateralForm.controls['name'].setValue(data['name']);
    this.collateralForm.controls['amount'].setValue(data['amount']);
    this.collateralForm.controls['typeOfCollateralId'].setValue(data['typeOfCollateralId']);
    this.collateralForm.controls['typeOfCollateralId'].disable({onlySelf: false});
  }

  createControl(config: FieldConfig) {
    const {disabled, validation, value, required} = config;
    const validationOptions = validation || [];
    if (required) {
      validationOptions.push(Validators.required);
    }
    return this.fb.control({disabled, value}, validationOptions);
  }
}
