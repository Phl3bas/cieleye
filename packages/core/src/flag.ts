import type yargs from 'yargs-parser'
import hash from 'object-hash'
import { FlagValidationError } from './errors'

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
    if (!Object.keys(args).includes(flag.name) && !Object.keys(args).includes(flag.alias))
      throw new FlagValidationError({ name: Object.keys(args).slice(1).toString(), alias: Object.keys(args).slice(1).toString() } as Flag<any>, 'not valid flag')

    let value = args[flag.name] || args[flag.alias]

    if (flag?.required) {
      if (!value)
        throw new FlagValidationError(flag, 'an argument is required for this flag')
    }

    if (value === undefined && Object.hasOwn(flag, 'default'))
      value = flag.default

    if (Object.hasOwn(flag, 'type') && !(typeof value === typeof flag?.type?.()))
      throw new FlagValidationError(flag, `invalid value type passed expected ${flag.type?.name} but receieved ${typeof value}`)

    if (Object.hasOwn(flag, 'validate') && !flag?.validate?.(value))
      throw new FlagValidationError(flag, `value ${value} did not pass validation`)

    flagValues[flag.name] = value
    flagValues[flag.alias] = value
  }

  return flagValues
}

export function defineFlag<T>(flag: Flag<T>): Flag<T> {
  const ID = hash(flag)

  Object.defineProperty(flag, 'ID', {
    enumerable: false,
    value: ID,
  })

  return flag
}

