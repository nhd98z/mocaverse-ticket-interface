declare global {
  interface Window {
    okxwallet?: any
  }
}

export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never

export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T
}

export type ValueOf<T> = T[keyof T]
