var express = require('express')
var sinon = require('sinon')
require('should')

var FilterRouter = require('../routes/filter_router')
var Filter = require('../lib/filters.js')

describe('FilterRouter', function () {
  var fr, router, _router

  beforeEach(function () {
    router = express.Router()
    _router = sinon.mock(router)
    fr = new FilterRouter({}, router)
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

      fr.routes().should.be.ok()
      verifyAll()
      done()
    })
  })

  describe('filters', function () {
    it('returns Filter when getter is called', function (done) {
      fr.filters.should.be.an.instanceOf(Filter)
      verifyAll()
      done()
    })
    it('allows Filter to be changed via setter', function (done) {
      var myFilter = {}
      fr.filters = myFilter
      fr.filters.should.equal(myFilter)
      verifyAll()
      done()
    })
  })
})
