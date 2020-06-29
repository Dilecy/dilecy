import { IdMap } from './types';

export function mapIdMap<T, R>(srcMap: IdMap<T>, mapMap: IdMap<R>): R[] {
  function* gen() {
    for (const id in srcMap) yield mapMap[id];
  }
  return Array.from(gen());
}
