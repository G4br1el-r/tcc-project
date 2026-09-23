export function queryAll<T extends Element = HTMLElement>(
  scope: ParentNode,
  selector: string,
): T[] {
  return Array.from(scope.querySelectorAll<T>(selector));
}

export function queryOne<T extends Element = HTMLElement>(
  scope: ParentNode,
  selector: string,
): T | null {
  return scope.querySelector<T>(selector);
}
