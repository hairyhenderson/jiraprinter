var IssueTypes = require('../lib/issuetypes')
var request = require('request')
var sinon = require('sinon')
var should = require('should')

var SAMPLE_JIRA_BODY = [{
  self: 'http://localhost:8090/jira/rest/api/latest/issueType/3',
  id: '3',
  description: 'A task that needs to be done.',
  iconUrl: 'http://localhost:8090/jira/images/icons/issuetypes/task.png',
  name: 'Task',
  subtask: false,
  avatarId: 1
}, {
  self: 'http://localhost:8090/jira/rest/api/latest/issueType/1',
  id: '1',
  description: 'A problem with the software.',
  iconUrl: 'http://localhost:8090/jira/images/icons/issuetypes/bug.png',
  name: 'Bug',
  subtask: false,
  avatarId: 10002
}]

describe('IssueTypes', function () {
  var issuetypes, _issuetypes, r, _res, res

  beforeEach(function () {
    r = sinon.mock(request)
    issuetypes = new IssueTypes({
      user: 'joe',
      password: 'foo',
      host: 'jira.example.com'
    })
    _issuetypes = sinon.mock(issuetypes)
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
    _issuetypes.restore()
  })

  function verifyAll () {
    r.verify()
    _res.verify()
    _issuetypes.verify()
  }

  describe('issuetype', function () {
    var requestOpts
    beforeEach(function () {
      requestOpts = {
        uri: issuetypes.host + '/rest/api/latest/issuetype',
        auth: {
          user: issuetypes.user,
          password: issuetypes.password
        },
        json: true
      }
    })

    it('yields JIRA issuetype results', function (done) {
      r.expects('get').withArgs(requestOpts).yields(null, {
        statusCode: 200
      }, SAMPLE_JIRA_BODY)

      issuetypes.issuetype(function (err, issuetypes) {
        should.not.exist(err)

        issuetypes.should.eql([ 'Task', 'Bug' ])
        verifyAll()
        done()
      })
    })
  })

  describe('get', function () {
    it('responds with issuetype results', function (done) {
      var s = [{
        name: 'foo'
      }, {
        name: 'bar'
      }]
      _issuetypes.expects('issuetype').yields(null, s)
      _res.expects('send').withArgs(s)

      issuetypes.get(null, res)
      done()
    })
  })
})
