var Issues = require('../lib/issues')
var request = require('request')
var sinon = require('sinon')
var should = require('should')

var SAMPLE_JIRA_BODY = {
  issues: [{
    key: 'JIRA-1111',
    fields: {
      issuetype: {
        name: 'Story'
      },
      priority: {
        name: 'Minor'
      },
      summary: 'As a user, I want to do something minor',
      status: {
        name: 'Open'
      }
    }
  }, {
    key: 'JIRA-1234',
    fields: {
      issuetype: {
        name: 'Story'
      },
      priority: {
        name: 'Major'
      },
      summary: 'As a user, I want to do something major',
      status: {
        name: 'In Progress'
      }
    }
  }]
}

describe('Issues', function () {
  var issues, _issues, r, _res, res

  beforeEach(function () {
    r = sinon.mock(request)
    issues = new Issues({
      board: 'Test Board',
      type: 'Story',
      user: 'joe',
      password: 'foo',
      host: 'jira.example.com'
    })
    _issues = sinon.mock(issues)
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
    _issues.restore()
  })

  function verifyAll () {
    r.verify()
    _res.verify()
    _issues.verify()
  }

  describe('_buildQuery', function () {
    it('should build JQL query with given inputs', function (done) {
      var expected = 'type = "Story" AND sprint in openSprints()'
      issues._buildQuery('Story', 'openSprints()').should.eql(expected)
      done()
    })
    it('should build query for Bugs given Bug input', function (done) {
      var expected = 'type = "Bug" AND sprint in openSprints()'
      issues._buildQuery('Bug', 'openSprints()').should.eql(expected)
      done()
    })
    it('should use right syntax given sprint ID', function (done) {
      var expected = 'type = "Story" AND sprint = 42'
      issues._buildQuery('Story', '42').should.eql(expected)
      done()
    })
  })

  describe('search', function () {
    var requestOpts
    beforeEach(function () {
      requestOpts = {
        uri: 'https://' + issues.host + '/rest/agile/latest/board/1/issue',
        auth: {
          user: issues.user,
          password: issues.password
        },
        qs: {
          jql: 'QUERY',
          fields: [
            'issuetype',
            'priority',
            'summary',
            'status'
          ]
        },
        json: true
      }
    })

    it('yields JIRA search results', function (done) {
      _issues.expects('_buildQuery').withArgs('Story', '42').returns('QUERY')
      r.expects('get').withArgs(requestOpts).yields(null, {
        statusCode: 200
      }, SAMPLE_JIRA_BODY)

      issues.search('Story', '1', '42', function (err, issues) {
        should.not.exist(err)

        issues.should.eql([{
          name: SAMPLE_JIRA_BODY.issues[0].fields.issuetype.name,
          key: SAMPLE_JIRA_BODY.issues[0].key,
          priority: SAMPLE_JIRA_BODY.issues[0].fields.priority.name,
          summary: SAMPLE_JIRA_BODY.issues[0].fields.summary,
          status: SAMPLE_JIRA_BODY.issues[0].fields.status.name,
          url: 'https://jira.example.com/browse/JIRA-1111'
        }, {
          name: SAMPLE_JIRA_BODY.issues[1].fields.issuetype.name,
          key: SAMPLE_JIRA_BODY.issues[1].key,
          priority: SAMPLE_JIRA_BODY.issues[1].fields.priority.name,
          summary: SAMPLE_JIRA_BODY.issues[1].fields.summary,
          status: SAMPLE_JIRA_BODY.issues[1].fields.status.name,
          url: 'https://jira.example.com/browse/JIRA-1234'
        }])
        verifyAll()
        done()
      })
    })
  })

  describe('get', function () {
    it('responds with no data given no board query param', function (done) {
      _res.expects('send').withArgs([])
      issues.get({}, res)
      verifyAll()
      done()
    })
    it('responds with Stories given no query params', function (done) {
      var req = {
        query: {
          board: 'Test Board'
        }
      }
      var s = [{
        name: 'foo'
      }, {
        name: 'bar'
      }]
      _issues.expects('search').withArgs('Story').yields(null, s)
      _res.expects('send').withArgs(s)

      issues.get(req, res)
      verifyAll()
      done()
    })
    it('responds with Bugs given issuetype=Bug query param', function (done) {
      var req = {
        query: {
          issuetype: 'Bug',
          board: 'Test Board'
        }
      }
      var s = [{
        name: 'foo'
      }, {
        name: 'bar'
      }]
      _issues.expects('search').withArgs('Bug', 'Test Board').yields(null, s)
      _res.expects('send').withArgs(s)

      issues.get(req, res)
      verifyAll()
      done()
    })
  })
})
