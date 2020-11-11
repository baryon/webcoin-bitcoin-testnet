const paramTests = require('webcoin-param-tests')
const test = require('tape')
const params = require('../')

test('param-tests', function (t) {
  paramTests(params, t.test.bind(t))
  t.end()
})
