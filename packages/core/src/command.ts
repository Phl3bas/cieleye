import type { Command } from './types'

export function selectCommand<F, S>(selectedCommands: (string | number)[], root: Command<F, S>): Command<F, S> {
  const command = selectedCommands.reduce((acc, cur) => {
    if (!acc.subcommands)
      return acc

    const a = acc.subcommands[cur as keyof S] as Command<F, S>

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

export function defineCommand<F = any, S = any>(command: Command<F, S>): Command<F, S> {
  if (command?.flags)
    command.flags = mapTo(command.flags, ['name', 'alias'])

  if (command?.subcommands)
    command.subcommands = mapTo(command.subcommands, ['name'])

  return command
}
