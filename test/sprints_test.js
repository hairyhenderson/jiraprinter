var Sprints = require('../lib/sprints')
var request = require('request')
var sinon = require('sinon')
var should = require('should')

var SAMPLE_JIRA_BODY = {
  values: [{
    id: 59,
    self: 'https://qliknext.atlassian.net/rest/agile/1.0/sprint/59',
    state: 'closed',
    name: 'Milestone 14, Beat 4',
    startDate: '2015-09-28T09:00:00.000-05:00',
    endDate: '2015-10-12T09:00:00.000-05:00',
    completeDate: '2015-10-13T09:25:41.730-05:00',
    originBoardId: 1
  }, {
    id: 60,
    self: 'https://qliknext.atlassian.net/rest/agile/1.0/sprint/60',
    state: 'active',
    name: 'Milestone 14, Beat 5',
    startDate: '2015-10-13T09:26:31.448-05:00',
    endDate: '2015-10-26T09:26:00.000-05:00',
    originBoardId: 1
  }, {
    id: 66,
    self: 'https://qliknext.atlassian.net/rest/agile/1.0/sprint/66',
    state: 'future',
    name: 'Milestone 15, Beat 1',
    originBoardId: 1
  }]
}

describe('Sprints', function () {
  var sprints, _sprints, r, _res, res

  beforeEach(function () {
    r = sinon.mock(request)
    sprints = new Sprints({
      user: 'joe',
      password: 'foo',
      host: 'jira.example.com'
    })
    _sprints = sinon.mock(sprints)
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
    _sprints.restore()
  })

  function verifyAll () {
    r.verify()
    _res.verify()
    _sprints.verify()
  }

  describe('sprint', function () {
    var requestOpts
    beforeEach(function () {
      requestOpts = {
        uri: 'https://' + sprints.host + '/rest/agile/latest/board/1/sprint',
        auth: {
          user: sprints.user,
          password: sprints.password
        },
        qs: {
          state: 'active,future'
        },
        json: true
      }
    })

    it('yields JIRA sprint results', function (done) {
      r.expects('get').withArgs(requestOpts).yields(null, {
        statusCode: 200
      }, SAMPLE_JIRA_BODY)

      sprints.sprint('1', function (err, sprints) {
        should.not.exist(err)

        sprints.should.eql(SAMPLE_JIRA_BODY.values)
        verifyAll()
        done()
      })
    })
  })

  describe('get', function () {
    it('responds with sprint results', function (done) {
      var s = [{
        name: 'foo'
      }, {
        name: 'bar'
      }]
      _sprints.expects('sprint').yields(null, s)
      _res.expects('send').withArgs(s)

      sprints.get({
        query: {
          boardId: '42'
        }
      }, res)
      done()
    })
  })
})
