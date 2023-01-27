/**
 * Created by Chyngyz on 1/25/2017.
 */
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cbs-response-popup',
  template: `
    <div class="cbs-response-block" *ngIf="status?.showSuccess">
        <div class="cbs-response-block__item">
            <ng-content select="[cbs-response-success-content]"></ng-content>
        </div>
    </div>

    <div class="cbs-response-block" *ngIf="status?.showError">
        <div class="cbs-response-block__item">
            <ng-content select="[cbs-response-error-content]"></ng-content>
        </div>
    </div>
`,
  styleUrls: ['response-popup.component.scss']
})
export class ResponsePopupComponent implements OnInit {
  @Input() status: { showSuccess: boolean, showError: boolean };

  constructor() {

  }

  ngOnInit() {
  }

}
