import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cbs-heading-block',
  template: `
    <div class="slds-media slds-no-space slds-grow">
        <div class="slds-media__figure" *ngIf="svgData">
            <svg aria-hidden="true" [attr.class]="'slds-icon slds-icon-' + svgData.collection + '-' + svgData.class">
                <use [attr.xlink:href]="'/assets/icons/' + svgData.collection + '-sprite/svg/symbols.svg#' + svgData.name"></use>
            </svg>
        </div>
        <div class="slds-media__body" [ngClass]="{'cbs-main-page': isMainPage}">
            <ng-content></ng-content>
            <h1 class="slds-page-header__title slds-m-right--small slds-align-middle" title="{{ headingTitle }}">
                {{ headingTitle  }}
                <ngl-badge *ngIf="badgeLabel" [type]="badgeTheme">{{ badgeLabel }}</ngl-badge>
            </h1>
        </div>
    </div>
`,
  styles: [`
    :host .slds-page-header__title {
      line-height: 1;
    }
    .cbs-main-page .slds-page-header__title {
      padding-top: 7px;
      font-size: 22px;
    }
    `]
})
export class HeadingBlockComponent implements OnInit {
  @Input() svgData: any;
  @Input() headingTitle: string;
  @Input() badgeLabel: string;
  @Input() badgeTheme: string;
  @Input() isMainPage: boolean;

  constructor() {
  }

  ngOnInit() {
  }
}
