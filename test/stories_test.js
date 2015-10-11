var Stories = require('../lib/stories')
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

describe('Stories', function () {
  var stories, _stories, r, _res, res

  beforeEach(function () {
    r = sinon.mock(request)
    stories = new Stories({
      project: 'Test Project',
      type: 'Story',
      user: 'joe',
      password: 'foo',
      host: 'jira.example.com'
    })
    _stories = sinon.mock(stories)
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
    _stories.restore()
  })

  function verifyAll () {
    r.verify()
    _res.verify()
    _stories.verify()
  }

  describe('_buildQuery', function () {
    it('should build JQL query with given inputs', function (done) {
      var expected = 'project = "Test Project" AND type = "Story" AND sprint in openSprints()'
      stories._buildQuery().should.eql(expected)
      done()
    })
  })

  describe('search', function () {
    var requestOpts
    beforeEach(function () {
      requestOpts = {
        uri: 'https://' + stories.host + '/rest/api/latest/search',
        auth: {
          user: stories.user,
          password: stories.password
        },
        json: {
          jql: 'QUERY',
          fields: [
            'issuetype',
            'priority',
            'summary',
            'status'
          ]
        }
      }
    })

    it('errors when connection to JIRA fails', function (done) {
      _stories.expects('_buildQuery').returns('QUERY')
      r.expects('post').withArgs(requestOpts).yields('ERROR')

      stories.search(function (err) {
        err.should.eql('ERROR')
        verifyAll()
        done()
      })
    })
    it('errors when JIRA replies with a non-OK HTTP code', function (done) {
      _stories.expects('_buildQuery').returns('QUERY')
      r.expects('post').withArgs(requestOpts).yields(null, {
        statusCode: 404,
        request: {
          method: 'POST',
          uri: 'the_uri'
        }
      }, 'not found')

      stories.search(function (err) {
        err.should.eql({
          message: 'got status 404 while POSTing to the_uri',
          method: 'POST',
          statusCode: 404,
          body: 'not found'
        })
        verifyAll()
        done()
      })
    })
    it('yields JIRA search results', function (done) {
      _stories.expects('_buildQuery').returns('QUERY')
      r.expects('post').withArgs(requestOpts).yields(null, {
        statusCode: 200
      }, SAMPLE_JIRA_BODY)

      stories.search(function (err, stories) {
        should.not.exist(err)

        stories.should.eql([{
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
    it('errors when search fails', function (done) {
      _stories.expects('search').yields('ERROR')

      stories.get(null, null, function (err) {
        err.should.eql('ERROR')
        verifyAll()
        done()
      })
    })
    it('responds with search results', function (done) {
      var s = [{
        name: 'foo'
      }, {
        name: 'bar'
      }]
      _stories.expects('search').yields(null, s)
      _res.expects('send').withArgs(s)

      stories.get(null, res)
      done()
    })
  })
})
