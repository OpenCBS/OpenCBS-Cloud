import { Component, Input, OnInit } from '@angular/core';

interface IconConfig {
  collection: string;
  name: string;
  className: string;
}

@Component({
  selector: 'cbs-icon',
  template: `
    <span [class]="'slds-icon_container slds-icon-' + iconConfig?.collection + '-' + iconConfig?.className"
          [ngClass]="classStyle">
        <svg [ngClass]="'slds-icon slds-icon--' + size" aria-hidden="true">
            <use xmlns:xlink="http://www.w3.org/1999/xlink"
                 [attr.xlink:href]="'/assets/icons/' + iconConfig?.collection + '-sprite/svg/symbols.svg#' + iconConfig?.name"></use>
        </svg>
    </span>
  `
})
export class IconComponent implements OnInit {
  @Input() iconConfig: IconConfig;
  @Input() classStyle: any;
  @Input() size = 'large';

  constructor() {
  }

  ngOnInit() {
  }

}
