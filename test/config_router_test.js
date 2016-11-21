var express = require('express')
var sinon = require('sinon')
require('should')

var ConfigRouter = require('../routes/config_router')

describe('ConfigRouter', function () {
  var cr, router, _router

  beforeEach(function () {
    router = express.Router()
    _router = sinon.mock(router)
    cr = new ConfigRouter({}, router)
    cr.configs = {
      get: function () {}
    }
  })

  afterEach(function () {
    _router.restore()
  })

  function verifyAll () {
    _router.verify()
  }

  describe('routes', function () {
    it('returns router', function (done) {
      _router.expects('get').withArgs('/')

      cr.routes().should.be.ok()
      verifyAll()
      done()
    })
  })
})
