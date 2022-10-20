import type { Command, Flag } from './types'

let rootCommand: string
let rootDescription: string
let rootFlags: string
interface CieleyeContext {
  name: string
  cli: Command<any, any, any>
  setContext: ({ cli, name }: { name: string; cli: Command<any, any, any> }) => void
  help(command?: Command): void
}

export const ctx: CieleyeContext = {
  name: '',
  cli: {} as Command<any, any, any>,
  setContext({ cli, name }) {
    this.cli = cli
    this.name = name
  },
  help(command?: Command<any, any, any>) {
    if (!command)
      command = this.cli

    const result = parseCommandHelpText(command)

    const useageStart = `${this.name} ${rootCommand}`

    console.log(`Useage:\n\t${command.useage?.map((use) => {
    return `\t${useageStart} ${use}\n`
  }).join('') || `${useageStart}\n`}
Description: 
\t${rootDescription}

Options:
\t${rootFlags}

${result ? `Sub-commands: ${result}` : ''}
    
    `)
  },

}

function parseFlagHelpText(flags: Record<string, Flag<any>>) {
  return Array.from(new Set(Object.values(flags))).map((f) => {
    return `-${f.alias}, --${f.name} ${f.type ? `<${f.type.name}>` : ''}${f.required ? ` <arguments>${f.default ? ` (${f.default})\t` : '\t'}` : '\t\t'}\t${f.description}`
  })
}

export function parseCommandHelpText(command: Command<any, any, any>, nested = false): string {
  if (!nested) {
    rootCommand = command.name === 'root' ? '' : command.name
    rootDescription = command.description
    rootFlags = parseFlagHelpText(command?.flags).join('\n')
  }

  if (!command?.subcommands)
    return `\t${command.name}\n\t\t${parseFlagHelpText(command.flags).join('\n')}`

  return Object.values(command.subcommands).reduce((acc, cur: any) => `${acc}\n${parseCommandHelpText(cur, true)}`, '') as string
}
