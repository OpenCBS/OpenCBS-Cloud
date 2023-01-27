import { Component, Input } from '@angular/core';

@Component({
  selector: 'cbs-activity-log',
  templateUrl: 'activity-log.component.html',
  styles: [`
        :host::ng-deep .cbs__application__activity-note {
            color: #425980;
            margin-top: 5px;
            margin-bottom: 5px;
        }
    `]
})
export class ActivityLogComponent {
  @Input() logData: any;
}
