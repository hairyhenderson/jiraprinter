var express = require('express')
var sinon = require('sinon')
require('should')

var BoardRouter = require('../routes/board_router')

describe('BoardRouter', function () {
  var br, router, _router

  beforeEach(function () {
    router = express.Router()
    _router = sinon.mock(router)
    br = new BoardRouter({}, router)
    br.boards = {
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

      br.routes().should.be.ok()
      verifyAll()
      done()
    })
  })
})
