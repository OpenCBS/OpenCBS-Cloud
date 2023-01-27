export function elementVisible(
  innerElement: string | HTMLElement,
  outerElement: string | HTMLElement | Window,
  adjustment?: any): { top: boolean, bottom: boolean, left: boolean, right: boolean } {

  let innerEl: HTMLElement;
  let outerEl: HTMLElement | Window;

  innerEl = (typeof innerElement === 'string') ?
    (<HTMLElement>document.querySelector(<string>innerElement)) : innerElement;
  outerEl = (typeof outerElement === 'string') ?
    (<HTMLElement | Window>document.querySelector(<string>outerElement)) : outerElement;

  let innerRect = innerEl.getBoundingClientRect();

  if (outerEl === window) {

    return {
      top: innerRect.bottom - (adjustment && adjustment.bottom || 0) > window.innerHeight
      && innerRect.top + (adjustment && adjustment.top || 0) < window.innerHeight,
      bottom: innerRect.bottom - (adjustment && adjustment.bottom || 0) > 0
      && innerRect.bottom - (adjustment && adjustment.bottom || 0) < window.innerHeight,
      left: innerRect.right > window.innerWidth
      && innerRect.left < window.innerWidth,
      right: innerRect.right > 0
      && innerRect.right < window.innerWidth
    };

  } else {

    let outerRect = (<HTMLElement>outerEl).getBoundingClientRect();
    let defaultView = (innerEl.ownerDocument || document).defaultView;
    let computedStyle = defaultView.getComputedStyle(<HTMLElement>outerEl, null);
    let outerRectBorderTopWidth = parseInt(computedStyle.getPropertyValue('border-top-width'), 10);
    let outerRectBorderLeftWidth = parseInt(computedStyle.getPropertyValue('border-left-width'), 10);

    /* top is visible or bottom is visible */
    let topVisible = (
      innerRect.top + (adjustment && adjustment.top || 0) >= outerRect.top
      && innerRect.top < outerRect.bottom
    );
    let bottomVisible = (
      innerRect.bottom - (adjustment && adjustment.bottom || 0) > (outerRect.top + outerRectBorderTopWidth)
      && innerRect.bottom < outerRect.bottom
    );
    let leftVisible = (
      innerRect.left >= outerRect.left
      && innerRect.left < outerRect.right
    );
    let rightVisible = (
      innerRect.right > (outerRect.left + outerRectBorderLeftWidth)
      && innerRect.right < outerRect.right
    );

    return {
      top: topVisible,
      bottom: bottomVisible,
      left: leftVisible,
      right: rightVisible
    };

  }
}
