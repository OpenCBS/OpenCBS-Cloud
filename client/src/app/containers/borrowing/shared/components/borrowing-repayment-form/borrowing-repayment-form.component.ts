import { Component, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { environment } from '../../../../../../environments/environment';
import * as fromRoot from '../../../../../core/core.reducer';
import { CurrentUserAppState } from '../../../../../core/store/users/current-user';

@Component({
  selector: 'cbs-borrowing-repayment-form',
  templateUrl: 'borrowing-repayment-form.component.html',
  styleUrls: ['borrowing-repayment-form.component.scss']
})

export class BorrowingRepaymentFormComponent implements OnInit, OnDestroy {
  @Output() onAutoTypeChange = new EventEmitter();
  @Output() onTotalEdited = new EventEmitter();
  @Output() onSetMaxAmount = new EventEmitter();
  @Input() maxAmount = '';
  private currentUserSub: any;
  public repaymentForm: FormGroup;
  public repaymentTypeList = [
    {
      value: 'NORMAL_REPAYMENT',
      name: 'NORMAL_REPAYMENT'
    }
  ];

  constructor(private fb: FormBuilder,
              private store$: Store<fromRoot.State>) {
  }

  ngOnInit() {
    this.repaymentForm = this.fb.group({
      date: new FormControl(moment().format(environment.DATE_FORMAT_MOMENT), Validators.required),
      repaymentType: new FormControl('NORMAL_REPAYMENT', Validators.required),
      penalty: new FormControl({value: '', disabled: true}, Validators.required),
      interest: new FormControl({value: '', disabled: true}, Validators.required),
      principal: new FormControl({value: '', disabled: true}, Validators.required),
      total: new FormControl('', [Validators.required])
    });

    this.currentUserSub = this.store$.select(fromRoot.getCurrentUserState)
    .subscribe((user: CurrentUserAppState) => {
      user.permissions.forEach((item) => {
        if (item.group === 'LOANS' && !item.permissions.includes('PAST_REPAYMENTS')) {
          this.repaymentForm.controls['date'].disable({emitEvent: false, onlySelf: true});
        }
      })
    });
  }

  markAsEdited() {
    this.onTotalEdited.emit();
  }

  ngOnDestroy() {
    this.currentUserSub.unsubscribe();
  }
}
