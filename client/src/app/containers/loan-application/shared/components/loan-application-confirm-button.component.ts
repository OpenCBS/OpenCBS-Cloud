import { Component, Output, EventEmitter, Renderer2, ElementRef, ViewChild, Input } from '@angular/core';
import { LoanAppStatusAware } from '../../loan-application-status.decorator';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'cbs-loan-app-confirm-button',
  template: `
    <button [disabled]="disabled" (click)="loanAppDisburse()" #disburseButton
      class="slds-button slds-button--success" aria-live="assertive">
        <span class="slds-text-not-selected">
          <svg aria-hidden="true" class="slds-button__icon--stateful slds-button__icon--left">
          <use xlink:href="assets/icons/utility-sprite/svg/symbols.svg#check"></use>
          </svg>{{ 'DISBURSE' | translate }}</span>
    </button>`
})

@LoanAppStatusAware
export class LoanAppDisburseButtonComponent {
  @ViewChild('disburseButton', {static: false}) disburseButton: ElementRef;
  @Output() onClickButton = new EventEmitter();
  @Input() disabled = false;
  private confirmText: any;

  constructor(private translate: TranslateService, private renderer2: Renderer2) {
  }

  loanAppDisburse() {
    this.getConfirmText();
    this.onClickButton.emit(this.confirmText);
    this.disableBtn(true);
  }

  disableBtn(bool) {
    this.renderer2.setProperty(this.disburseButton.nativeElement, 'disabled', bool);
  }

  getConfirmText() {
    this.translate.get('DISBURSE_CONFIRM_TEXT').subscribe((res) => {
      this.confirmText = res;
    });
  }
}
