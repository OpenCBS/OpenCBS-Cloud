import { AbstractHandler } from './abstract.handler';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';

@Injectable({providedIn: 'root'})
export class NotificationHandler extends AbstractHandler {
  private readonly TYPE = 'NOTIFICATION';

  constructor(private toastrService: ToastrService) {
    super();
  }

  getType(): string {
    return this.TYPE;
  }

  handleMessage(body: any): void {
    switch (body.type) {
      case 'error':
        this.toastrService.error(body.message, '', environment.ERROR_TOAST_CONFIG);
        return;
      case 'warning':
        this.toastrService.warning(body.message, '', environment.WARNING_TOAST_CONFIG);
        return;
      case 'success':
        this.toastrService.success(body.message, '', environment.SUCCESS_TOAST_CONFIG);
        return;
      default:
        this.toastrService.info(body.message, '', environment.INFO_TOAST_CONFIG);
    }
  }
}
