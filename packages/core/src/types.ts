import type { Answers, QuestionCollection } from 'inquirer'

interface CommandOptions<F, S, P> {
  name: string
  flags?: F
  subcommands?: S
  prompt?: P & Prompt<any>
  action: (args: { flags: Record<keyof F, FlagType<F[keyof F]>>; answers: Answers }) => any
  before?: () => any
  after?: () => any
}

type FlagType<T> = T extends Flag<infer I> ? I : never

export type Command<F = any, S = any, P = any> = CommandOptions<F, S, P> & ThisType<{ help: () => void }>

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

export type Prompt<T extends Answers> = QuestionCollection<T>

