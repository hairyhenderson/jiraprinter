var Resource = require('../lib/resource')
var should = require('should')
var sinon = require('sinon')

describe('Resource', function () {
  var resource, _resource, _res, res

  beforeEach(function () {
    resource = new Resource()
    _resource = sinon.mock(resource)
    res = {
      status: function () {},
      send: function () {},
      end: function () {}
    }
    _res = sinon.mock(res)
  })

  afterEach(function () {
    _res.restore()
    _resource.restore()
  })

  function verifyAll () {
    _res.verify()
    _resource.verify()
  }

  describe('_handleResponse', function () {
    it('errors when JIRA connection fails', function (done) {
      resource._handleResponse('ERROR', null, null, function (err, body) {
        err.should.eql('ERROR')
        should(body).not.exist
        done()
      })
    })
    it('errors when JIRA replies with a non-OK HTTP code', function (done) {
      resource._handleResponse(null, {
        statusCode: 404,
        request: {
          method: 'GET',
          uri: 'the_uri'
        }
      }, 'not found', function (err) {
        err.should.eql({
          message: 'got status 404 while GETing to the_uri',
          method: 'GET',
          statusCode: 404,
          body: 'not found'
        })
        done()
      })
    })
  })

  describe('_getHandler', function () {
    it('returns a function', function (done) {
      resource._getHandler.should.be.a.function
      done()
    })
    describe('handler', function () {
      it('errors when resource fails', function (done) {
        var error = 'ERROR'
        resource._getHandler(res, function (err) {
          should(err).eql(error)
          verifyAll()
          done()
        })(error)
      })
      it('502s when upstream errors', function (done) {
        var error = {
          statusCode: 500,
          message: 'upstream failure!'
        }
        _res.expects('status').withArgs(502).returns(res)
        _res.expects('send').withArgs(error)

        var next = sinon.spy()

        resource._getHandler(res, next)(error)
        next.called.should.be.false()

        verifyAll()
        done()
      })
      it('responds with sprint results', function (done) {
        var result = [{
          foo: true
        }]
        _res.expects('send').withArgs(result)

        var next = sinon.spy()

        resource._getHandler(res, next)(null, result)
        next.called.should.be.false()

        verifyAll()
        done()
      })
    })
  })
})
