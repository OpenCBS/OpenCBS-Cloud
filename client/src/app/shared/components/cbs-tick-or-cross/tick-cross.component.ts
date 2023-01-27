import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cbs-tickorcross',
  templateUrl: 'tick-cross.component.html',
  styleUrls: ['./tick-cross.component.scss']
})
export class TickCrossComponent implements OnInit {
  @Input() isTick = true;

  constructor() {
  }

  ngOnInit() {
  }
}

