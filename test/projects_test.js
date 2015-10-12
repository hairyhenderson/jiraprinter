var Projects = require('../lib/projects')
var request = require('request')
var sinon = require('sinon')
var should = require('should')

var SAMPLE_JIRA_BODY = [{
  self: 'http://localhost:8090/jira/rest/api/latest/issueType/3',
  id: '3',
  description: 'A task that needs to be done.',
  iconUrl: 'http://localhost:8090/jira/images/icons/projects/task.png',
  name: 'Task',
  subtask: false,
  avatarId: 1
}, {
  self: 'http://localhost:8090/jira/rest/api/latest/issueType/1',
  id: '1',
  description: 'A problem with the software.',
  iconUrl: 'http://localhost:8090/jira/images/icons/projects/bug.png',
  name: 'Bug',
  subtask: false,
  avatarId: 10002
}]

describe('Projects', function () {
  var projects, _projects, r, _res, res

  beforeEach(function () {
    r = sinon.mock(request)
    projects = new Projects({
      user: 'joe',
      password: 'foo',
      host: 'jira.example.com'
    })
    _projects = sinon.mock(projects)
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
    _projects.restore()
  })

  function verifyAll () {
    r.verify()
    _res.verify()
    _projects.verify()
  }

  describe('project', function () {
    var requestOpts
    beforeEach(function () {
      requestOpts = {
        uri: 'https://' + projects.host + '/rest/api/latest/project',
        auth: {
          user: projects.user,
          password: projects.password
        },
        json: true
      }
    })

    it('errors when connection to JIRA fails', function (done) {
      r.expects('get').withArgs(requestOpts).yields('ERROR')

      projects.project(function (err) {
        err.should.eql('ERROR')
        verifyAll()
        done()
      })
    })
    it('errors when JIRA replies with a non-OK HTTP code', function (done) {
      r.expects('get').withArgs(requestOpts).yields(null, {
        statusCode: 404,
        request: {
          method: 'GET',
          uri: 'the_uri'
        }
      }, 'not found')

      projects.project(function (err) {
        err.should.eql({
          message: 'got status 404 while GETing to the_uri',
          method: 'GET',
          statusCode: 404,
          body: 'not found'
        })
        verifyAll()
        done()
      })
    })
    it('yields JIRA project results', function (done) {
      r.expects('get').withArgs(requestOpts).yields(null, {
        statusCode: 200
      }, SAMPLE_JIRA_BODY)

      projects.project(function (err, projects) {
        should.not.exist(err)

        projects.should.eql([ 'Task', 'Bug' ])
        verifyAll()
        done()
      })
    })
  })

  describe('get', function () {
    it('errors when project fails', function (done) {
      _projects.expects('project').yields('ERROR')

      projects.get(null, null, function (err) {
        err.should.eql('ERROR')
        verifyAll()
        done()
      })
    })
    it('responds with project results', function (done) {
      var s = [{
        name: 'foo'
      }, {
        name: 'bar'
      }]
      _projects.expects('project').yields(null, s)
      _res.expects('send').withArgs(s)

      projects.get(null, res)
      done()
    })
  })
})
