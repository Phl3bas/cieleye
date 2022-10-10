import { defineCommand, runCLI } from 'cieleye'

const root = defineCommand({
  name: 'root',
  flags: {
    test: {
      name: 'test',
      alias: 't',
      default: './',
    },
  },
  action({ flags, answers }) {
    console.log({ flags, answers })
  },
})

runCLI(root)
