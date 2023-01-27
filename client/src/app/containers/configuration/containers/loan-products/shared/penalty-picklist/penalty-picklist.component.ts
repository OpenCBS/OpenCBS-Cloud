import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'cbs-penalty-picklist',
  templateUrl: 'penalty-picklist.component.html',
  styleUrls: ['penalty-picklist.component.scss']
})

export class PenaltiesPicklistComponent {
  @Input() penalties = [];
  @Input() selectDataLabel: string;
  @Input() disablePickList: string;
  @Output() onPenaltySelect = new EventEmitter();
  public pick: any = [];
  public open: boolean;

  constructor() {
  }

  selectPenalty(penalties) {
    this.penalties.filter(a => {
      if ( a['name'] === penalties.name ) {
        this.penalties.splice(this.penalties.indexOf(a), 1);
      }
    });
    this.onPenaltySelect.emit(penalties);
  }

}
