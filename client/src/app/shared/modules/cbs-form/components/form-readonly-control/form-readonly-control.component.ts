import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {ReadOnlyOutputEnum} from '../../../../enums/ReadOnlyOutputEnum';

@Component({
  selector: 'cbs-form-readonly-control',
  templateUrl: './form-readonly-control.component.html',
  styleUrls: ['./form-readonly-control.component.scss']
})
export class FormReadonlyControlComponent implements OnInit {
  @Input() fieldLabel = <string>'';
  @Input() value = <any>'';
  @Input() disabled = true;
  @Input() styleClass = <any>'';
  @Input() style = <any>'';
  @Input() showLink: boolean;
  @Input() isTextarea = <boolean>false;
  @Input() outputType;
  @Output() onFieldClick = new EventEmitter();

  public outputTypeEnum = ReadOnlyOutputEnum;

  constructor() {
  }

  ngOnInit() {
  }

}
