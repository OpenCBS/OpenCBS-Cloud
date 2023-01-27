import { Component, Input } from '@angular/core';

@Component({
  selector: 'cbs-payee-read-only',
  templateUrl: 'payee-read-only-modal.component.html',
  styles: [`
        .slds-form-element__control {
            border: 1px solid #e4e4e4;
            border-radius: 0.25rem;
            padding: 0 1rem 0 0.75rem;
            height: 2rem;
        }
        .slds-form-element__control--textarea {
            height: auto;
            min-height: 76px;
        }
    `]
})

export class PayeeReadOnlyComponent {
  @Input() headerTitle: string;
  public isOpen = false;
  public name: string;
  public disbursementDate: string;
  public amount: number;
  public description: string;

  openModal(data) {
    this.isOpen = true;
    this.name = data.payee.name;
    this.disbursementDate = data.disbursementDate;
    this.amount = data.amount;
    this.description = data.description;
  }
}
