/**
 * Created by Chyngyz on 2/17/2017.
 */
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cbs-image',
  template: `
    <figure class="slds-image slds-image--card slds-m-right--medium cbs-profile-info__img"  *ngIf="imageUrl && image" (click)="imgClick()">
        <a href="javascript:void(0);" class="slds-image__crop slds-image__crop--1-by-1">
            <img [src]="imageUrl" [attr.alt]="imageAltText">
        </a>
        <figcaption class="slds-image__title slds-image__title--card" *ngIf="imageCaption">
            <span class="slds-image__text slds-truncate" [attr.title]="imageCaption">{{ imageCaption }}</span>
        </figcaption>
    </figure>
    <figure class="slds-image slds-image--card slds-m-right--medium cbs-profile-info__img" *ngIf="!image">
        <a href="javascript:void(0);" class="slds-image__crop slds-image__crop--1-by-1">
            <img [src]="imagePlaceholder" [attr.alt]="imageAltText" />
        </a>
        <figcaption class="slds-image__title slds-image__title--card" *ngIf="imageCaption">
            <span class="slds-image__text slds-truncate" [attr.title]="imageCaption">{{ imageCaption }}</span>
        </figcaption>
    </figure>
`
})
export class ImageComponent implements OnInit {
  @Input() imageUrl: string;
  @Input() imageAltText = 'Image';
  @Input() imageCaption: string;
  @Input() imagePlaceholder = '/img/placeholder-img.jpg';
  @Input() image = false;

  @Output() onClick = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  imgClick() {
    this.onClick.emit();
  }
}
