import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cbs-card',
  template: `
    <a [routerLink]="cardLink" class="cbs-icon-card" [ngClass]="cardClass">
      <cbs-icon
        *ngIf="cardIcon"
        [iconConfig]="cardIcon"
        [classStyle]="'slds-m-bottom--small'"
      ></cbs-icon>
      <span class="cbs-icon-card__title" *ngIf="cardTitle">{{ cardTitle }}</span>
      <span class="cbs-icon-card__desc" *ngIf="cardDesc">{{ cardDesc }}</span>
    </a>
`,
  styleUrls: ['card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() cardIcon: any;
  @Input() cardClass: string;
  @Input() cardTitle: string;
  @Input() cardDesc: string;
  @Input() cardLink: string;

  constructor() {
  }

  ngOnInit() {
  }
}
