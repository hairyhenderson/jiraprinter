var express = require('express')
var sinon = require('sinon')
require('should')

var SprintRouter = require('../routes/sprint_router')

describe('SprintRouter', function () {
  var sr, router, _router

  beforeEach(function () {
    router = express.Router()
    _router = sinon.mock(router)
    sr = new SprintRouter({}, router)
    sr.sprints = {
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

      sr.routes().should.be.ok()
      verifyAll()
      done()
    })
  })
})
