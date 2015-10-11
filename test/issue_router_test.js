var express = require('express')
var sinon = require('sinon')
require('should')

var IssueRouter = require('../routes/issue_router')

describe('IssueRouter', function () {
  var ir, router, _router

  beforeEach(function () {
    router = express.Router()
    _router = sinon.mock(router)
    ir = new IssueRouter({}, router)
    ir.issues = {
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

      ir.routes().should.be.ok()
      verifyAll()
      done()
    })
  })
})
