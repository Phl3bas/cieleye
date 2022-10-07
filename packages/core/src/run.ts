import yargs from 'yargs-parser'
import type { Command, Flag } from './types'

export function defineFlag<T>(flag: Flag<T>): Flag<T> {
  return flag
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

  console.log(command)

  return command
}

function help() {
  console.log('HELP!')
}

export function runCLI<F, S>(rootCommand: Command<F, S>, args = yargs(process.argv)) {
  const selectedCommands = args._.slice(2)

  const command = selectedCommands.reduce((acc, cur) => {
    if (!acc.subcommands)
      return acc

    const a = acc.subcommands[cur as keyof S] as Command<any, any>

    if (a)
      acc = a

    return acc
  }, rootCommand)

  const defaultFlagValueMap = command.flags
    ? Object.entries(command?.flags).reduce((acc, [key, value]: [string, any]) => {
      acc[key] = value?.default ?? false

      return acc
    }, {} as any)
    : {}

  const flags = Object.entries(args).filter(([key]) => key !== '_' && key !== '__').reduce((acc, [key, value]) => {
    if (command.flags && command.flags[key as keyof F]) {
      const flag = command.flags[key as keyof F] as Flag<any>

      if (flag.default !== typeof value) {
        console.error('ERROR')
      }
      else if (flag?.validate?.(value) ?? true) {
        const name = flag.name
        const alias = flag.alias

        acc[name] = value
        acc[alias] = value
      }
      else {
        console.error('ERROR')
      }
    }

    return acc
  }, defaultFlagValueMap as Record<string, string | boolean>)

  console.log({ flags, command: command.flags })

  // console.log(command)

  command.action.call({ help }, flags as any)
}

// find subcommand
// validate flags
// run before hook
// run prompt
// run action
// run after
