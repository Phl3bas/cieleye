import { defineCommand, defineFlag, runCLI } from 'cieleye'

const out = defineCommand({
  name: 'inner',
  action() {
    console.log('INNER ACTION')
  },
})

const config = defineFlag<string>({
  name: 'config',
  alias: 'c',
  description: 'config for app',
  required: false,
  default: './config.js',
  validate(value) {
    return value.includes('.config.js')
  },
})

const p = new Promise(resolve => resolve('hello'))

const bum = defineCommand({
  name: 'run',
  flags: { config },
  async action(props) {
    console.log(props)
    console.log('RUN ACTION')

    const a = await p
    console.log(a)
  },
})

const root = defineCommand({
  name: 'TEST',
  flags: { config },
  subcommands: { bum, out },
  action() {
    this.help()
  },
})

runCLI(root)
