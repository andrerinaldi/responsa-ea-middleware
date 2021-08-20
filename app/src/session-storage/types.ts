export type Session<T extends Record<string, any>> = {
  id: string
} & T
