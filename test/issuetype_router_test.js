var express = require('express')
var sinon = require('sinon')
require('should')

var IssueTypeRouter = require('../routes/issuetype_router')

describe('IssueTypeRouter', function () {
  var itr, router, _router

  beforeEach(function () {
    router = express.Router()
    _router = sinon.mock(router)
    itr = new IssueTypeRouter({}, router)
    itr.issuetypes = {
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

      itr.routes().should.be.ok()
      verifyAll()
      done()
    })
  })
})
