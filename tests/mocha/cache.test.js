'use strict'

const assert = require('./assert')

const value1 = 'Hello World!'
const value2 = 'Goodbye...'

describe('cache', function () {
  let mocked

  before(async () => {
    mocked = await require('./setup')
  })

  it('returns nothing if not cached', () => mocked.request('GET', '/none')
    .then(response => {
      assert(() => response.statusCode === 204)
      assert(() => !response.toString())
    })
  )

  it('signal creation', () => mocked.request('POST', '/test', {}, value1)
    .then(response => {
      assert(() => response.statusCode === 201)
      assert(() => !response.toString())
    })
  )

  it('returns cached value', () => mocked.request('GET', '/test')
    .then(response => {
      assert(() => response.statusCode === 200)
      assert(() => response.toString() === value1)
    })
  )

  it('updates cached value', () => mocked.request('POST', '/test', {}, value2)
    .then(response => {
      assert(() => response.statusCode === 200)
      assert(() => !response.toString())
    })
  )

  it('returns updated value', () => mocked.request('GET', '/test')
    .then(response => {
      assert(() => response.statusCode === 200)
      assert(() => response.toString() === value2)
    })
  )

  it('clears cached value', () => mocked.request('DELETE', '/test')
    .then(response => {
      assert(() => response.statusCode === 204)
      assert(() => !response.toString())
    })
  )

  it('returns nothing after clearing', () => mocked.request('GET', '/test')
    .then(response => {
      assert(() => response.statusCode === 204)
      assert(() => !response.toString())
    })
  )

  it('ignores other verbs', () => mocked.request('PUT', '/none', {}, '?')
    .then(response => {
      assert(() => response.statusCode === 500)
    })
  )
})
