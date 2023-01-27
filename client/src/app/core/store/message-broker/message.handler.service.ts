import { Injectable, Injector } from '@angular/core';
import { MessageMQ } from './message.models'
import { AbstractHandler } from './message-handlers/abstract.handler';
import { DayClosureHandler } from './message-handlers/day.closure.handler';
import { NotificationHandler } from './message-handlers/notification.handler';

@Injectable({providedIn: 'root'})
export class MessageHandlerService {
  private handlers: Array<AbstractHandler> = [];

  constructor(private injector: Injector) {
    this.initHandlers();
  }

  public handleMessage(message: MessageMQ): void {
    const handler = this.handlers.find(x => x.getType() === message.messageType)
    if (!handler) {
      return;
    }
    handler.handleMessage(message.payload);
  }

  private initHandlers(): void {
    // register all message handlers
    this.handlers.push(this.injector.get(DayClosureHandler));
    this.handlers.push(this.injector.get(NotificationHandler));
  }
}
