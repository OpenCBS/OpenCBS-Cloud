import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { CFBuilderService } from '../cf-builder.service';

@Component({
  selector: 'cbs-cf-section',
  templateUrl: 'cf-section.component.html',
  styleUrls: ['cf-section.component.scss']
})
export class CFSectionComponent implements OnInit {
  @Input() url: string;
  @Input() sectionData: any;
  @Output() onEditSuccess = new EventEmitter();
  @Output() onEditError = new EventEmitter();
  @Output() onAddSuccess = new EventEmitter();
  @Output() onAddError = new EventEmitter();
  @Output() onAddCancel = new EventEmitter();
  @ViewChild('caption', {static: false, read: ElementRef}) captionInput: ElementRef;
  public isEditView = false;
  public newSectionMode = false;
  public formChanged = false;

  private cachedCaption: string;

  constructor(private service: CFBuilderService) {
  }

  ngOnInit() {
  }

  submitForm({valid, value}) {
    if ( valid && value.caption !== this.cachedCaption && !this.newSectionMode ) {
      this.updateSection(value);
    } else if ( valid && this.newSectionMode ) {
      this.createSection(value);
    }
  }

  updateSection(data) {
    this.service.updateSection(this.url, this.sectionData.id, data).subscribe(
      resp => {
        this.onEditSuccess.emit(resp);
        this.closeEdit();
      },
      err => {
        alert(err.error.message);
        this.onEditError.emit(err.error);
      }
    );
  }

  createSection(data) {
    this.service.createSection(this.url, data).subscribe(
      resp => {
        this.onAddSuccess.emit(resp);
        this.closeEdit();
        this.newSectionMode = false;
      },
      err => {
        alert(err.error.message);
        this.onAddError.emit(err.error);
      }
    );
  }

  activateEdit(cachedCaption) {
    this.cachedCaption = cachedCaption;
    this.isEditView = true;
    this.focusCaptionInput();
  }

  checkValueChange(value) {
    this.formChanged = value !== this.cachedCaption;
  }

  closeEdit() {
    this.cachedCaption = '';
    this.formChanged = false;

    if ( this.newSectionMode ) {
      this.onAddCancel.emit();
    } else {
      this.isEditView = false;
    }
  }

  activateNewSectionMode() {
    this.newSectionMode = true;
    this.isEditView = true;
    this.focusCaptionInput();
  }

  focusCaptionInput() {
    setTimeout(() => {
      this.captionInput.nativeElement.focus();
    });
  }
}
