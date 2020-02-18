'use strict'

const $cache = Symbol('REserve/cache@data')

function send (response, statusCode, value) {
  if (value) {
    response.writeHead(statusCode, {
      'Content-Type': 'text/plain',
      'Content-Length': value.length
    })
  } else {
    response.writeHead(statusCode)
  }
  response.end(value)
}

const handlers = {}

handlers.GET = async ({ cache, redirect, response }) => {
  const value = cache[redirect]
  if (value === undefined) {
    send(response, 204)
  } else {
    send(response, 200, value)
  }
}

function readBody (request) {
  return new Promise((resolve, reject) => {
    const buffer = []
    request
      .on('data', chunk => buffer.push(chunk.toString()))
      .on('error', reject)
      .on('end', () => resolve(buffer.join('')))
  })
}

handlers.POST = async ({ cache, redirect, request, response }) => {
  let statusCode
  if (Object.prototype.hasOwnProperty.call(cache, redirect)) {
    statusCode = 200
  } else {
    statusCode = 201
  }
  cache[redirect] = await readBody(request)
  send(response, statusCode)
}

handlers.DELETE = async ({ cache, redirect, response }) => {
  delete cache[redirect]
  send(response, 204)
}

module.exports = {
  async validate (mapping) {
    mapping[$cache] = {}
  },

  async redirect ({ mapping, match, redirect, request, response }) {
    const handler = handlers[request.method]
    if (handler) {
      return handler({ cache: mapping[$cache], redirect, request, response })
    }
    return 500
  }
}
