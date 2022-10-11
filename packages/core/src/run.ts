import yargs from 'yargs-parser'
import inquirer from 'inquirer'
import type { Command } from './types'
import { selectCommand } from './command'
import { validateFlags } from './flag'
import { ctx } from './context'

const promptModule = inquirer.createPromptModule()

export async function runCLI<F, S, P>(rootCommand: Command<F, S, P>, args = yargs(process.argv)) {
  const command = selectCommand<F, S, P>(args._.slice(2), rootCommand)

  const flags = validateFlags(args, command as any)
  let answers

  try {
    await command.before?.()

    if (command.prompt)
      answers = await promptModule(command?.prompt)

    await command.action.call(ctx, { flags, answers } as any)
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
