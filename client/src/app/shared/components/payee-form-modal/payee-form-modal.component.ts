import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { IPayeeItem } from '../../../core/store/loan-application';
import * as moment from 'moment';
import { ViewChild } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormLookupControlComponent } from '../../modules/cbs-form/components';

@Component({
  selector: 'cbs-payee-form-modal',
  templateUrl: 'payee-form-modal.component.html',
  styleUrls: ['payee-form-modal.component.scss']
})

export class PayeeFormModalComponent implements OnInit {
  @ViewChild('payee', {static: false}) payee: FormLookupControlComponent;
  @Input() headerTitle: string;
  @Output() onSubmit = new EventEmitter();
  public isOpen = false;
  public form: any;
  public payeeLookupUrl = {
    url: `${environment.API_ENDPOINT}payees/lookup`
  };
  public plannedDisbursementDate = moment().format(environment.DATE_FORMAT_MOMENT);

  ngOnInit() {
    this.form = new FormGroup({
      id: new FormControl(''),
      payee: new FormControl('', Validators.required),
      payeeId: new FormControl('', Validators.required),
      plannedDisbursementDate: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    });
  }

  openCreateModal() {
    this.payee.onClearLookup();
    this.form.reset();
    this.isOpen = true;
  }

  submit() {
    this.isOpen = false;
    this.onSubmit.emit(this.form.value);
  }

  cancel() {
    this.isOpen = false;
  }

  setPayeeDetails(payee) {
    this.form.controls['payee'].setValue(payee, {emitEvent: false});
    this.form.controls['plannedDisbursementDate'].setValue(this.plannedDisbursementDate);
  }

  openEditModal(data: IPayeeItem) {
    this.form.controls['id'].setValue(data.id);
    this.form.controls['payee'].setValue(data.payee);
    this.form.controls['payeeId'].setValue(data.payeeId);
    this.form.controls['plannedDisbursementDate'].setValue(data.plannedDisbursementDate);
    this.form.controls['amount'].setValue(data.amount);
    this.form.controls['description'].setValue(data.description);

    this.isOpen = true;
  }
}
