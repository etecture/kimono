// see https://github.com/facebook/react/issues/11095
// based on https://jsfiddle.net/oavm1px8/
export default function setNativeInputValue(element: HTMLElement, value: string, shouldDispatchEvent: boolean) {
  const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), 'value');
  if (!descriptor || !descriptor.set) {
    return;
  }
  descriptor.set.call(element, value);
  if (shouldDispatchEvent) {
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }
}
