import type { Command, Flag, Prompt } from './types'

export function selectCommand<F, S, P>(selectedCommands: (string | number)[], root: Command<F, S, P>): Command<F, S, P> {
  const command = selectedCommands.reduce((acc, cur) => {
    if (!acc.subcommands)
      return acc

    const a = acc.subcommands[cur as keyof S] as Command<F, S, P>

    if (a)
      acc = a

    return acc
  }, root)

  return command
}

function mapTo<T extends Record<string, any>>(obj: T, toMapTo: string[]) {
  return Object.entries(obj).reduce((acc, [_, value]) => {
    for (const key of toMapTo)
      acc[value[key as keyof T] as keyof T] = value

    return acc as T
  }, {} as T)
}

export function defineCommand<F = Record<string, Flag<unknown>>, S = Record<string, Command>, P = Prompt<any>>(command: Command<F, S, P>): Command<F, S, P> {
  if (command?.flags)
    command.flags = mapTo(command.flags, ['name', 'alias'])

  if (command?.subcommands)
    command.subcommands = mapTo(command.subcommands, ['name'])

  return command
}
