// GNU nano 6.4                                                                                                    http-client.js
const HttpAgent = require('agentkeepalive')
// const QuickLRU = require('../vendor/quick-lru')
const got = require('got')

const DEFAULT_USER_AGENT = `Mozilla/5.0 (compatible; allOrigins/${global.AO_VERSION}; +http://allorigins.win/)`

module.exports = (function defaultGot() {
  const gotOptions = {
    agent: {
      http: new HttpAgent({
        keepAlive: false,
      }),
      https: new HttpAgent.HttpsAgent({
        keepAlive: false,
      }),
    },
    responseType: 'buffer',
    dnsCache: true,
    headers: { 'user-agent': process.env.USER_AGENT || DEFAULT_USER_AGENT },
  }

  const gotInstance = got.extend(gotOptions)

  return { got: gotInstance }
})()






