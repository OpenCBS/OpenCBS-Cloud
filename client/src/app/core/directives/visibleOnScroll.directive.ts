import {
  Directive,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  Renderer2,
  OnDestroy,
  OnInit,
  AfterViewInit
} from '@angular/core';
import { elementVisible } from '../utils/element-visible.utils';

@Directive({
  selector: '[cbsVisibleOnSroll]'
})
export class VisibleOnScrollDirective implements OnInit, AfterViewInit, OnDestroy {
  @Input() scrollableBlockId: string;
  @Input() horizontal: boolean;
  @Input() visibilityTopOffset: number;
  @Input() visibilityBottomOffset: number;
  @Output() elementVisible = new EventEmitter();

  sections: Element[] = [];
  el: HTMLElement;
  scrollableEl: HTMLElement;
  visible: any = elementVisible;

  constructor(el: ElementRef,
              private renderer2: Renderer2) {
    this.el = el.nativeElement;
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    setTimeout(() => {
      for (let i = 0; i < this.el.children.length; i++) {
        const childEl = this.el.children[i];
        this.sections.push(childEl);
      }

      if (this.scrollableBlockId) {
        this.scrollableEl = <HTMLElement>document.querySelector(this.scrollableBlockId);
        this.renderer2.setStyle(this.scrollableEl, 'position', 'relative');

        const thisElStyle = window.getComputedStyle(this.scrollableEl);
        const elToListenScroll = thisElStyle.overflow === 'auto' ? this.scrollableEl : window;
        this.listenScrollOn(elToListenScroll);
      } else {
        const thisElStyle = window.getComputedStyle(this.el);
        const elToListenScroll = thisElStyle.overflow === 'auto' ? this.el : window;
        this.listenScrollOn(elToListenScroll);
      }

    });
  }

  ngOnDestroy() {
    this.detachEvent(this.scrollableEl || this.el || window);
  }

  private listenScrollOn(el: HTMLElement | Window): void {
    (<HTMLElement>el).addEventListener('scroll', this.handleScroll(el));
  }

  private detachEvent(el: HTMLElement | Window): void {
    (<HTMLElement>el).removeEventListener('scroll', this.handleScroll(el));
  }

  private handleScroll(element: HTMLElement | Window) {
    return () => {
      let elScrolledToVisible: HTMLElement = null;
      for (let i = 0; i < this.sections.length; i++) {
        const section = <HTMLElement>this.sections[i];
        const adjustments = {
          top: (this.visibilityTopOffset || 0),
          bottom: (this.visibilityBottomOffset || 0)
        };
        const visible = this.visible(section, <HTMLElement>element, adjustments);
        if (visible.top || visible.bottom) {
          elScrolledToVisible = section;
          break;
        }
      }
      if (elScrolledToVisible) {
        this.elementVisible.emit(elScrolledToVisible);
      }
    }
  }
}
