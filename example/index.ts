import { defineCommand, defineFlag, runCLI } from 'cieleye'

const test = defineFlag({
  name: 'test',
  alias: 't',
  description: 'this is a description',
  required: false,
  default: './hi',
  type: String,

})

const run = defineCommand({
  name: 'run',
  description: 'runs some stuff',

  flags: {
    fast: {
      name: 'fast',
      alias: 'f',
      description: 'makes it go faster',
      default: false,
      type: Boolean,
      required: true,
    },
  },
  action() {},
})

const stop = defineCommand({
  name: 'stop',
  description: 'stops more stuff',
  flags: {
    slowly: {
      name: 'slowly',
      alias: 's',
      description: 'makes it go faster',
      default: false,
      type: Boolean,
      required: false,
    },
  },
  action() {},
})

const dev = defineCommand({
  name: 'dev',
  description: 'dev some stuff',
  useage: ['<name>', '<name>@<tag>', '<name>@<version>'],
  flags: {
    go: {
      name: 'go',
      alias: 'g',
      description: 'makes it go faster',
      default: false,
      type: Boolean,
      required: false,
    },
  },
  action() {},
})

const root = defineCommand({
  name: 'root',
  description: 'does a thing',
  flags: { test },
  subcommands: {
    run,
    dev,
    stop,
  },
  action({ flags, answers }) {
    console.log({ flags, answers })
  },
})

runCLI(root, { name: 'my_cli' })
