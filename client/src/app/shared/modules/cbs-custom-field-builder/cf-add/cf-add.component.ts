import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'cbs-cf-add',
  templateUrl: 'cf-add.component.html',
  styleUrls: ['cf-add.component.scss']
})
export class CFAddComponent implements OnInit {
  @Input() buttonTitle: string;
  @Input() disabled: boolean;
  @Input() uid: number;
  @Output() onClick = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  click() {
    this.onClick.emit();
  }
}
