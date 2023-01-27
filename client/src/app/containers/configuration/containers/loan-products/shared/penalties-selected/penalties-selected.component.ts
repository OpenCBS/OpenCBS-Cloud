import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'cbs-penalties-selected',
  templateUrl: 'penalties-selected.component.html',
  styleUrls: ['penalties-selected.component.scss']
})

export class SelectedPenaltiesComponent {
  @Input() label: string;
  @Input() selectedPenalties = [];
  @Output() onPenaltyDelete = new EventEmitter();
  @Input() displayButton = true;

  constructor() {
  }


  delete(penalties) {
    this.selectedPenalties.filter(a => {
      if ( a.id === penalties.id ) {
        this.selectedPenalties.splice(this.selectedPenalties.indexOf(a), 1);
      }
    });
    this.onPenaltyDelete.emit(penalties);
  }
}
