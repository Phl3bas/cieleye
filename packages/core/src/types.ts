interface CommandOptions<F, S> {
  name: string
  flags?: F
  subcommands?: S
  prompt?: Record<string, any>
  action: (args: Record<keyof F, FlagType<F[keyof F]>>) => any
  before?: () => any
  after?: () => any
}

type FlagType<T> = T extends Flag<infer I> ? I : never

export type Command<F = any, S = any> = CommandOptions<F, S> & ThisType<{ help: () => void }>

interface FlagBase<T = boolean> {
  name: string
  alias: string
  description: string
  validate?: (value: T) => boolean
}

export type Flag<T> = FlagBase<T> & {
  required: true
  default?: T
} | FlagBase<T> & {
  required: false
  default: T
}

