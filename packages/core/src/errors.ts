import type { Flag } from './types'

export class CieleyeError extends Error {
  constructor(message: string) {
    super(`cieleye/${message}`)
  }
}

export class CommandError extends CieleyeError {
  constructor(command: string | number) {
    super(`command-error: command '${command}' was not found`)
  }
}

export class FlagValidationError extends CieleyeError {
  constructor(flag: Flag<any>, message: string) {
    super(`flag-validation-error: (-${flag.name} or --${flag.alias}) ${message}`)
  }
}
