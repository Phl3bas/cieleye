import type yargs from 'yargs-parser'

import type { Command, Flag } from './types'

export function mapDefaultFlagValues(command: Command) {
  return command.flags
    ? Object.entries(command?.flags).reduce((acc, [key, value]: [string, any]) => {
      acc[key] = value?.default ?? false

      return acc
    }, {} as any)
    : {}
}

export function validateFlags(args: yargs.Arguments, command: Command) {
  const flagValues = mapDefaultFlagValues(command)

  if (!command.flags)
    return

  for (const flag of Object.values(command.flags)) {
    let value = args[flag.name] || args[flag.alias]

    if (flag?.required) {
      if (!value) {
        console.error('no flag passed when required')
        process.exit(1)
      }
    }

    if (value === undefined && Object.hasOwn(flag, 'default'))
      value = flag.default

    if (Object.hasOwn(flag, 'type') && !(typeof value === typeof flag?.type?.())) {
      console.log('flag passed did not pass validation: Type Assertion')
      process.exit(1)
    }

    if (Object.hasOwn(flag, 'validate') && !flag?.validate?.(value)) {
      console.log('flag passed did not pass validation: Validate Function')
      process.exit(1)
    }

    flagValues[flag.name] = value
    flagValues[flag.alias] = value
  }

  return flagValues
}

export function defineFlag<T>(flag: Flag<T>): Flag<T> {
  return flag
}

