import { defineCommand, defineFlag, runCLI } from 'cieleye'

const test = defineFlag({
  name: 'test',
  alias: 't',
  description: 'this is a description',
  required: false,
  default: './hi',

})

const root = defineCommand({
  name: 'root',
  flags: { test },
  action({ flags, answers }) {
    console.log({ flags, answers })
  },
})

runCLI(root)
