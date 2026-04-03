export type SignalListener<T> = (value: T) => void;

export class Signal<T> {
  private listeners: Set<SignalListener<T>> = new Set();
  private _value: T | undefined;

  constructor(initialValue?: T) {
    this._value = initialValue;
  }

  get value(): T | undefined {
    return this._value;
  }

  set value(newValue: T | undefined) {
    this._value = newValue;
    this.notify();
  }

  subscribe(listener: SignalListener<T>): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(): void {
    this.listeners.forEach(listener => listener(this._value as T));
  }
}

export function createSignal<T>(initialValue?: T): Signal<T> {
  return new Signal(initialValue);
}
