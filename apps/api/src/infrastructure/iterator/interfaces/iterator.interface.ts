export interface Iterator<T> {
  hasNext(): Promise<boolean>;
  next(): Promise<T[]>;
}
