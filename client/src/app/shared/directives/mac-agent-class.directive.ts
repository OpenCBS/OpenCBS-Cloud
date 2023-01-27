import { Directive, ElementRef, Renderer2, Input, AfterViewInit } from '@angular/core';
import { WindowRefService } from '../../core/services/window.service';

@Directive({
  selector: '[cbsMacAgent]'
})
export class MacAgentClassDirective implements AfterViewInit {
  @Input() cbsMacAgentClass: string;
  public el: ElementRef;
  private _window: Window;

  constructor(el: ElementRef,
              private renderer2: Renderer2,
              private windowRef: WindowRefService) {
    this._window = windowRef.nativeWindow;
    this.el = el;
  }

  ngAfterViewInit() {
    const isMacOrIOS = !!this._window.navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i);
    if (isMacOrIOS && this.cbsMacAgentClass) {
      this.renderer2.addClass(this.el.nativeElement, this.cbsMacAgentClass);
    }
  }
}
