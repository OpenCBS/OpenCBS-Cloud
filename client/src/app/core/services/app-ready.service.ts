import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable()
export class AppReadyService {
  private doc: Document;
  private isAppReady: boolean;

  constructor(@Inject(DOCUMENT) doc: any) {
    this.doc = doc;
    this.isAppReady = false;
  }

  public trigger(): void {
    if (this.isAppReady) {
      return;
    }
    const bubbles = true;
    const cancelable = false;
    this.doc.dispatchEvent(this.createEvent('appready', bubbles, cancelable));
    this.isAppReady = true;
  }

  private createEvent(eventType: string, bubbles: boolean, cancelable: boolean): Event {
    let customEvent: any;
    // IE Fallback
    try {
      customEvent = new CustomEvent(
        eventType,
        {
          bubbles: bubbles,
          cancelable: cancelable
        }
      );
    } catch (error) {
      customEvent = this.doc.createEvent('appready');
      customEvent.initCustomEvent(eventType, bubbles, cancelable);
    }
    return (customEvent);
  }
}
