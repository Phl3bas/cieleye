import type yargs from 'yargs-parser'
import type { Command, Flag } from './types'

export function mapDefaultFlagValues<F, S, P>(command: Command<F, S, P>) {
  return command.flags
    ? Object.entries(command?.flags).reduce((acc, [key, value]: [string, any]) => {
      acc[key] = value?.default ?? false

      return acc
    }, {} as any)
    : {}
}

export function validateFlags<F, S, P>(args: yargs.Arguments, command: Command<F, S, P>) {
  const defaultFlagValueMap = mapDefaultFlagValues(command)

  return Object.entries(args).filter(([key]) => key !== '_' && key !== '__').reduce((acc, [key, value]) => {
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
}

export function defineFlag<T>(flag: Flag<T>): Flag<T> {
  return flag
}

