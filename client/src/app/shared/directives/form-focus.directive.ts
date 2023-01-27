import { Directive, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[cbsFormFocus]'
})

export class FormFocusDirective implements AfterViewInit {
  public el: ElementRef;

  constructor(el: ElementRef) {
    this.el = el;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      let firstField = this.el.nativeElement.querySelector('.slds-form-element');
      let field = firstField.querySelector('.slds-form-element__control [formcontrolname="value"]') ||
        firstField.querySelector('.slds-form-element__control .slds-input:not([hidden])') ||
        firstField.querySelector('.slds-form-element__control .slds-select:not([hidden])') ||
        firstField.querySelector('.slds-form-element__control .slds-textarea:not([hidden])');

      if (field) {
        field.focus();
      }
    });
  }
}
