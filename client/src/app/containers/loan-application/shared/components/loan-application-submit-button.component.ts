import { Component, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LoanAppStatusAware } from '../../loan-application-status.decorator';


@Component({
  selector: 'cbs-loan-app-submit-button',
  template: `
    <button (click)="loanAppSubmit()"
      class="slds-button slds-button-space-left slds-button--success" aria-live="assertive">
        <span class="slds-text-not-selected">
            <svg aria-hidden="true" class="slds-button__icon--stateful slds-button__icon--left">
            <use xlink:href="assets/icons/utility-sprite/svg/symbols.svg#check"></use>
            </svg>{{ 'SUBMIT' | translate }}</span>
    </button>`
})

@LoanAppStatusAware
export class LoanAppSubmitButtonComponent {
  @Output() onClickButton = new EventEmitter();
  private confirmText: string;

  constructor(private translate: TranslateService) {
  }

  loanAppSubmit() {
    this.getConfirmText();
    this.onClickButton.emit(this.confirmText);
  }

  getConfirmText() {
    this.translate.get('LOAN_APP_SUBMIT_TEXT').subscribe((res) => {
      this.confirmText = res;
    });
  }
}
