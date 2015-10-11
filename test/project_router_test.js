var express = require('express')
var sinon = require('sinon')
require('should')

var ProjectRouter = require('../routes/project_router')

describe('ProjectRouter', function () {
  var pr, router, _router

  beforeEach(function () {
    router = express.Router()
    _router = sinon.mock(router)
    pr = new ProjectRouter({}, router)
    pr.projects = {
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

      pr.routes().should.be.ok()
      verifyAll()
      done()
    })
  })
})
