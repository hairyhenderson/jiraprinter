var Filters = require('../lib/filters')
var request = require('request')
var sinon = require('sinon')
var should = require('should')

var SAMPLE_JIRA_BODY = {
  values: [
    {
      'self': 'http://localhost:8080/rest/api/2/filter/10001',
      'id': '10001',
      'name': 'Demo-A-Filter-1'
    },
    {
      'self': 'http://localhost:8080/rest/api/2/filter/10002',
      'id': '10002',
      'name': 'Demo-A-Filter-2'
    }
  ]
}

describe('Filters', function () {
  var filters, _filters, r, _res, res

  beforeEach(function () {
    r = sinon.mock(request)
    filters = new Filters({
      user: 'joe',
      password: 'foo',
      host: 'https://jira.example.com'
    })
    _filters = sinon.mock(filters)
    res = {
      status: function () {},
      send: function () {},
      end: function () {}
    }
    _res = sinon.mock(res)
  })

  afterEach(function () {
    r.restore()
    _res.restore()
    _filters.restore()
  })

  function verifyAll () {
    r.verify()
    _res.verify()
    _filters.verify()
  }

  describe('filter', function () {
    var requestOpts
    beforeEach(function () {
      requestOpts = {
        uri: filters.host + '/rest/api/latest/filter/favourite',
        auth: {
          user: filters.user,
          password: filters.password
        },
        json: true
      }
    })

    it('yields JIRA board results', function (done) {
      r.expects('get').withArgs(requestOpts).yields(null, {
        statusCode: 200
      }, SAMPLE_JIRA_BODY)

      filters.filter(function (err, results) {
        should.not.exist(err)

        results.should.eql(SAMPLE_JIRA_BODY)
        verifyAll()
        done()
      })
    })
  })

  describe('get', function () {
    it('responds with board results', function (done) {
      var s = [{
        name: 'foo'
      }, {
        name: 'bar'
      }]
      _filters.expects('filter').yields(null, s)
      _res.expects('send').withArgs(s)

      filters.get(null, res)
      done()
    })
  })
})
