import { defineCommand, defineFlag, runCLI } from 'cieleye'

const P1 = function (v: any, t = 500) {
  return new Promise<string>((resolve) => {
    setTimeout(() => { resolve(v) }, t)
  })
}

const flag = defineFlag({
  name: 'flag',
  alias: 'f',
  description: 'its a flag',
  required: false,
  default: false,
})

const root = defineCommand({
  name: 'TEST',
  flags: {
    flag,
  },
  prompt: [{ name: 'hi there', type: 'list', choices: ['react', 'vue'] }],
  async before() {
    const h = await P1('hi', 1000)

    console.log(h)
  },
  async action({ flags, answers }) {
    console.log({ flags: flags.flag })
    console.log({ answers })
    // console.log('hihihihihi')
  },
})

runCLI(root)
