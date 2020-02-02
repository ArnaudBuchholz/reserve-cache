'use strict'

module.exports = require('reserve/mock')({
  port: 8000,
  handlers: {
    cache: require('../../index.js')
  },
  mappings: [{
    match: /\/(.*)/,
    cache: '$1'
  }]
})
