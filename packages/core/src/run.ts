import yargs from 'yargs-parser'
import inquirer from 'inquirer'
import chalk from 'chalk'
import type { Command } from './types'
import { selectCommand } from './command'
import { validateFlags } from './flag'
import { ctx } from './context'
import { CieleyeError } from './errors'

interface RunCLIOptions {
  name: string
  inquirer?: {
    plugins?: [string, inquirer.prompts.PromptConstructor][]
  }
}

export async function runCLI<F, S, P>(rootCommand: Command<F, S, P>, options: RunCLIOptions) {
  options = { ...options }

  const args = yargs(process.argv)
  ctx.setContext({ name: options.name, cli: rootCommand as Command })

  const promptModule = inquirer.createPromptModule()

  if (options.inquirer?.plugins?.length) {
    options.inquirer?.plugins.forEach(([key, prompt]) => {
      promptModule.registerPrompt(key, prompt)
    })
  }

  try {
    const command = selectCommand<F, S, P>(args._.slice(2), rootCommand)

    const isHelp = args.help || args.h

    if (isHelp)
      return ctx.help(command as Command)

    const flags = validateFlags(args, command as any)
    let answers

    await command.before?.()

    if (command.prompt)
      answers = await promptModule(command?.prompt)

    await command.action.call(ctx, { flags, answers } as any)

    await command.after?.()
  }
  catch (err) {
    if (err instanceof CieleyeError) {
      console.error(chalk.red(err.message))
      console.log(' ')
      ctx.help()
      console.log(' ')
      process.exit()
    }

    throw err
  }
}

// find subcommand
// validate flags
// run before hook
// run prompt
// run action
// run after
