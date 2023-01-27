import { Component, Input } from '@angular/core';

@Component({
  selector: 'cbs-history-log',
  templateUrl: 'history-log.component.html',
  styles: [`
        :host ::ng-deep .cbs__application__history-note {
            color: #425980;
            margin-top: 5px;
            margin-bottom: 5px;
        }
    `]
})
export class HistoryLogComponent {
  @Input() logData: any;
}
