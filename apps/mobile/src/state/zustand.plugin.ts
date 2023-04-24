import { PersistStorage, StateStorage, StorageValue } from 'zustand/middleware';

export function createJSONStorage<S>(
  getStorage: () => StateStorage
): PersistStorage<S> | undefined {
  let storage: StateStorage | undefined;
  try {
    storage = getStorage();
  } catch (e) {
    // prevent error if the storage is not defined (e.g. when server side rendering a page)
    return;
  }
  const persistStorage: PersistStorage<S> = {
    getItem: name => {
      const parse = (str: string | null) => {
        if (str === null) {
          return null;
        }
        return JSON.parse(str, reviver) as StorageValue<S>;
      };
      const str = (storage as StateStorage).getItem(name) ?? null;
      if (str instanceof Promise) {
        return str.then(parse);
      }
      return parse(str);
    },
    setItem: (name, newValue) =>
      (storage as StateStorage).setItem(name, JSON.stringify(newValue, replacer)),
    removeItem: name => (storage as StateStorage).removeItem(name),
  };
  return persistStorage;
}

const replacer = (key: string, value: unknown): ReplacedMap | unknown => {
  if (value instanceof Map) {
    return {
      type: 'Map',
      value: Array.from(value.entries()),
    };
  } else {
    return value;
  }
};

const reviver = (key: string, value: ReplacedMap | unknown) => {
  if (isReplacedMap(value)) {
    return new Map(value.value);
  }
  return value;
};

const isReplacedMap = (value: any): value is ReplacedMap => {
  if (value && value.type === 'Map') {
    return true;
  }

  return false;
};

type ReplacedMap = {
  type: 'Map';
  value: [string, unknown][];
};
