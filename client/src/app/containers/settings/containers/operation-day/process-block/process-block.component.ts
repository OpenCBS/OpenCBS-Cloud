import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'cbs-process-block',
  templateUrl: './process-block.component.html',
  styleUrls: ['./process-block.component.scss']
})
export class ProcessBlockComponent implements OnInit {
  @Input() buttonLabel: string;
  @Input() date = '';
  @Input() statusData: any;
  @Input() title: string;
  @Input() disabled: false;
  @Output() dateChange = new EventEmitter();
  @Output() onStartClick = new EventEmitter();
  @Output() onFinishClick = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

}
