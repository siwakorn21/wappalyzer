const express = require('express')
const app = express()
const port = 3000

const Wappalyzer = require('../drivers/npm/driver')

const crawling = async (args) => {
  const options = {}

  let url
  let arg

  const aliases = {
    a: 'userAgent',
    b: 'batchSize',
    d: 'debug',
    t: 'delay',
    h: 'help',
    D: 'maxDepth',
    m: 'maxUrls',
    p: 'probe',
    P: 'pretty',
    r: 'recursive',
    w: 'maxWait',
    n: 'noScripts',
    N: 'noRedirect',
  }

  while (true) {
    // eslint-disable-line no-constant-condition
    arg = args.shift()

    if (!arg) {
      break
    }

    const matches = /^-?-([^=]+)(?:=(.+)?)?/.exec(arg)

    if (matches) {
      const key =
        aliases[matches[1]] ||
        matches[1].replace(/-\w/g, (_matches) => _matches[1].toUpperCase())
      // eslint-disable-next-line no-nested-ternary
      options[key] = matches[2]
        ? matches[2]
        : args[0] && !args[0].startsWith('-')
        ? args.shift()
        : true
    } else {
      url = arg
    }
  }

  return await (async function () {
    const wappalyzer = new Wappalyzer(options)

    try {
      await wappalyzer.init()

      const site = await wappalyzer.open(url)

      const results = await site.analyze()

      await wappalyzer.destroy()

      return results
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)

      await wappalyzer.destroy()

      process.exit(1)
    }
  })()
}

app.get('/', async (req, res) => {
  const url = req.query.url
  try {
    if (url) {
      const result = await crawling([url])
      res.setHeader('Content-Type', 'application/json')
      res.status(200).json(result)
    } else {
      res.status(404).send('Please set url parameter')
    }
  } catch (err) {
    res.status(404).send(err)
  }
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
