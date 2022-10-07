import { defineCommand, runCLI } from 'cieleye'

const P1 = function (v: any, t = 500) {
  return new Promise<string>((resolve) => {
    setTimeout(() => { resolve(v) }, t)
  })
}

const root = defineCommand({
  name: 'TEST',
  async before() {
    const h = await P1('hi', 1000)

    console.log(h)
  },
  action() {
    console.log('hohohoh')
  },
})

runCLI(root)
