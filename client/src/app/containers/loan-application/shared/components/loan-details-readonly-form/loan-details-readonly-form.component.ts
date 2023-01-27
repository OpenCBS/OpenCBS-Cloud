import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'cbs-loan-details-readonly-form',
  templateUrl: 'loan-details-readonly-form.component.html',
  styleUrls: ['loan-details-readonly-form.component.scss']
})
export class LoanDetailsReadOnlyFormComponent implements OnInit {
  @Input() formData: any;

  constructor() {
  }

  ngOnInit() {
  }
}
