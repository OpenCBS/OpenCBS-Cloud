export function scrollTo(selector: string,
                         parentSelector?: string,
                         horizontal?: boolean,
                         distance?: number): void {
  // argument validation
  let parentEl: HTMLElement, targetEl: HTMLElement;

  parentSelector = parentSelector || 'body';

  targetEl = <HTMLElement>document.querySelector(selector);
  if (!targetEl) {
    throw `Invalid selector ${selector}`;
  }

  parentEl = <HTMLElement>document.querySelector(parentSelector);
  if (!parentEl) {
    throw `Invalid parent selector ${parentSelector}`;
  }

  // detect the current environment
  const parentElStyle = window.getComputedStyle(parentEl);
  const scrollContainerEl = parentElStyle.overflow === 'auto' ? parentEl : document.body;
  let currentScrollTop = scrollContainerEl.scrollTop;
  let currentScrollLeft = scrollContainerEl.scrollLeft;

  // determine targetOffsetTop(or Left);
  let targetOffsetTop: number;
  let targetOffsetLeft: number;

  if (scrollContainerEl === document.body) {

    const bodyRect = document.body.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();
    targetOffsetTop = targetRect.top - bodyRect.top;
    targetOffsetLeft = targetRect.left - bodyRect.left;

  } else {

    targetOffsetTop = targetEl.offsetTop;
    targetOffsetLeft = targetEl.offsetLeft;

  }

  if (distance) {
    currentScrollTop += distance;
    currentScrollLeft += distance;
  }


  const step = horizontal ?
    Math.ceil((targetOffsetLeft - currentScrollLeft) / 10) :
    Math.ceil((targetOffsetTop - currentScrollTop) / 10);
  const scrollProp = horizontal ? 'scrollLeft' : 'scrollTop';
  (

  function loop(i: number, prop: any): void {
    setTimeout(function main() {
      scrollContainerEl[prop] += step;
      if (i > 1) {
        loop(i - 1, prop);
      }
    }, 20);
  }

  (10, scrollProp)
)
  ;

}
