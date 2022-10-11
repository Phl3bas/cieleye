import type { Answers, QuestionCollection } from 'inquirer'

interface CommandOptions<F = Record<string, Flag<unknown>>, S = Record<string, Command>, P = Prompt<any>> {
  name: string
  flags?: F
  subcommands?: S
  prompt?: P
  action: (args: { flags: Record<keyof F, FlagType<F[keyof F]>>; answers: Answers }) => any
  before?: () => any
  after?: () => any
}

type FlagType<T> = T extends Flag<infer I> ? I : never

export type Command<F = Record<string, Flag<unknown>>, S = Record<string, unknown>, P = Prompt<any>> = CommandOptions<F, S, P> & ThisType<{ help: () => void }>

interface FlagBase<T = boolean> {
  name: string
  alias: string
  description: string
  type?: StringConstructor | BooleanConstructor
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

