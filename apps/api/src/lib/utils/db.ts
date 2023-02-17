export function exclude<T, Key extends keyof T>(
  value: T,
  ...keys: Key[]
): Omit<T, Key> {
  for (const key of keys) {
    delete value[key];
  }
  return value;
}
