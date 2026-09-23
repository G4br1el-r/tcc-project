export function isSameIdSet(
  current: ReadonlyArray<string>,
  submitted: ReadonlyArray<string>,
): boolean {
  if (current.length !== submitted.length) return false;
  const unique = new Set(submitted);
  if (unique.size !== submitted.length) return false;
  return current.every((id) => unique.has(id));
}

export function hasOrderChanged(
  saved: ReadonlyArray<string>,
  local: ReadonlyArray<string>,
): boolean {
  if (saved.length !== local.length) return true;
  return saved.some((id, index) => local[index] !== id);
}

export function mergeOrder(
  local: ReadonlyArray<string>,
  saved: ReadonlyArray<string>,
): string[] {
  const savedIds = new Set(saved);
  const localIds = new Set(local);
  return [
    ...local.filter((id) => savedIds.has(id)),
    ...saved.filter((id) => !localIds.has(id)),
  ];
}
