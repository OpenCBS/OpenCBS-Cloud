import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { range } from '../loan-details-form/loan-details-form-validators';
import { ILoanAppState } from '../../../../../core/store/loan-application/loan-application/loan-application.reducer';
import { ILoanAppFormState } from '../../../../../core/store/loan-application/loan-application-form/loan-application-form.interfaces';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'cbs-entry-fees-modal',
  templateUrl: './entry-fees-modal.component.html',
  styleUrls: ['./entry-fees-modal.component.scss']
})
export class EntryFeesModalComponent implements OnInit, AfterViewInit {
  @Input() loanAppFormState: ILoanAppFormState;
  @Input() headerTitle = '';
  @Output() resetFeeCalculation = new EventEmitter();
  @Output() onSaveNewValue = new EventEmitter();
  public loanAppState: ILoanAppState;
  public entryFees: any[];
  public entryFeesForm: FormGroup;
  public feeFields = [];
  public formGenerated = false;
  public isOpen = false;

  public cachedCalculatedFees = [];
  private entryFeeNewValues = [];
  private formChangeSub: Subscription;

  constructor(public fb: FormBuilder,
              public loanAppFormStore$: Store<ILoanAppFormState>) {
  }

  ngOnInit() {
    this.entryFeesForm = this.fb.group({
      fees: new FormArray([]),
      total: new FormControl({value: '', disabled: true})
    });
  }

  ngAfterViewInit() {
    this.formChangeSub = this.entryFeesForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged())
      .subscribe(data => {
        this.collectFormData(this.entryFeesForm.getRawValue(), this.feeFields);
      });
  }

  populateCached(entryFees) {
    this.feeFields = [];
    entryFees.map(fee => {
      this.feeFields.push({
        id: fee.id,
        name: fee.code,
        caption: fee.name,
        fieldType: 'NUMERIC',
        value: fee.amount,
        edited: fee.edited,
        minValue: fee.minValue,
        maxValue: fee.maxValue,
        minLimit: fee.minLimit,
        maxLimit: fee.maxLimit,
        validate: fee.validate,
        percentage: fee.percentage
      });
    });
    if ( !!this.feeFields.length ) {
      this.generateCustomFields(this.feeFields);
    }
  }

  generateCustomFields(fieldsArray) {
    const fields = <FormArray>this.entryFeesForm.controls['fees'];

    if ( fields.length ) {
      fields.getRawValue().map(field => {
        fields.removeAt(fields.controls.indexOf(field));
      });
    }

    fieldsArray.map(item => {
      const group = this.fb.group({});
      group.addControl(item.name, this.createControl(item));
      fields.push(group);
    });

    this.formGenerated = true;
  }

  createControl(config: any) {
    const {validation, value, required} = config;
    const validationOptions = validation || [];
    if ( required || config['validate'] ) {
      validationOptions.push(Validators.required);
    }
    if ( config.validate ) {
      validationOptions.push(range([config.minValue, config.maxValue]));
    }
    return this.fb.control({disabled: config.minValue === config.maxValue, value: (value ? value : 0)}, validationOptions);
  }

  hasEditedField() {
    return this.feeFields.some(field => field.edited);
  }

  saveNewEntryFees() {
    this.onSaveNewValue.emit(this.entryFeeNewValues);
  }

  collectFormData(formValue: { fees, total }, fields: any[]) {
    this.entryFeeNewValues = [];
    if ( fields.length ) {
      fields.map(field => {
        if ( formValue.fees && formValue.fees.length ) {
          formValue.fees.map(item => {
            if ( Object.keys(item)[0] === field.name ) {
              this.entryFeeNewValues.push({
                id: field.id,
                amount: +item[Object.keys(item)[0]],
                name: field.caption,
                code: field.name,
                edited: false,
                minValue: field.minValue,
                maxValue: field.maxValue,
                minLimit: field.minLimit,
                maxLimit: field.maxLimit,
                validate: field.validate
              });
            }
          });
        }
      });
      if ( this.entryFeeNewValues.length ) {
        this.entryFeeNewValues.map(fee => {
          this.cachedCalculatedFees.map(cached => {
            if ( fee.id === cached.id ) {
              const equalAmounts = fee.amount !== cached.amount;
              fee.edited = equalAmounts;
              if ( equalAmounts ) {
                this.feeFields.map(field => {
                  if ( field.id === fee.id ) {
                    field.edited = true;
                  }
                });
              }
            }
          });
        });
      }

      let total = 0;
      this.entryFeeNewValues.map(fee => {
        total += +fee['amount'];
      });
      this.entryFeesForm.controls['total'].setValue(total.toFixed(2), {emitValue: false});
    }
  }
}
