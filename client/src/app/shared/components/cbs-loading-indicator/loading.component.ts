import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cbs-loading-indicator',
  template: `
    <div class="spinner-block" [ngClass]="{'is-fixed': isFixed}" *ngIf="showLoader">
      <div class="slds-spinner_container">
        <div class="slds-spinner_block">
          <div class="sk-folding-cube">
            <div class="top slds-m-horizontal_xx-small">
              <div class="cube1 cube top-left-drop-angle"></div>
              <div class="cube2 cube bottom-right-drop-angle"></div>
            </div>
            <div class="middle">
              <div class="cube3 cube top-right-drop-angle"></div>
              <div class="cube4 cube"></div>
              <div class="cube5 cube"></div>
              <div class="cube6 cube bottom-left-drop-angle"></div>
            </div>
            <div class="bottom slds-m-horizontal_xx-small">
              <div class="cube7 cube top-left-drop-angle"></div>
              <div class="cube8 cube bottom-right-drop-angle"></div>
            </div>
          </div>
        </div> 
      </div>
    </div>
  `,
  styleUrls: ['loading.component.scss']
})
export class LoadingIndicatorComponent implements OnInit {
  @Input() showLoader = false;
  @Input() isFixed = false;

  constructor() {
  }

  ngOnInit() {
  }
}
