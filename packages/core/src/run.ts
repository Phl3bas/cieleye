import yargs from 'yargs-parser'
import type { Command } from './types'
import { selectCommand } from './command'
import { validateFlags } from './flag'
import { ctx } from './context'

export async function runCLI<F, S>(rootCommand: Command<F, S>, args = yargs(process.argv)) {
  const command = selectCommand<F, S>(args._.slice(2), rootCommand)

  const flags = validateFlags(args, command)

  try {
    await command.before?.()
    // command.prompt?.()
    await command.action.call(ctx, flags as any)
    await command.after?.()
  }
  catch (err) {
    console.log(err)
    process.exit(1)
  }
}

// find subcommand
// validate flags
// run before hook
// run prompt
// run action
// run after
