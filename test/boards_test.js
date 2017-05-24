var Boards = require('../lib/boards')
var request = require('request')
var sinon = require('sinon')
var should = require('should')

var SAMPLE_JIRA_BODY = {
  values: [ {
    self: 'http://localhost:8090/jira/rest/agile/latest/board/3',
    id: '3',
    name: 'Board Three',
    type: 'scrum'
  }, {
    self: 'http://localhost:8090/jira/rest/agile/latest/board/1',
    id: '1',
    name: 'Board One',
    type: 'kanban'
  }]
}

describe('Boards', function () {
  var boards, _boards, r, _res, res

  beforeEach(function () {
    r = sinon.mock(request)
    boards = new Boards({
      user: 'joe',
      password: 'foo',
      host: 'https://jira.example.com'
    })
    _boards = sinon.mock(boards)
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
    _boards.restore()
  })

  function verifyAll () {
    r.verify()
    _res.verify()
    _boards.verify()
  }

  describe('board', function () {
    var requestOpts
    beforeEach(function () {
      requestOpts = {
        uri: boards.host + '/rest/agile/latest/board',
        auth: {
          user: boards.user,
          password: boards.password
        },
        json: true
      }
    })

    it('yields JIRA board results', function (done) {
      r.expects('get').withArgs(requestOpts).yields(null, {
        statusCode: 200
      }, SAMPLE_JIRA_BODY)

      boards.board(function (err, boards) {
        should.not.exist(err)

        boards.should.eql(SAMPLE_JIRA_BODY.values)
        verifyAll()
        done()
      })
    })

    it('yields JIRA board results and calls API with name query param when boardName config exists', function (done) {
      var config = {
        user: 'joe',
        password: 'foo',
        host: 'https://jira.example.com',
        boardName: 'Some Board'
      }
      boards = new Boards(config)
      _boards = sinon.mock(boards)
      requestOpts = {
        uri: boards.host + '/rest/agile/latest/board?name=' + config.boardName,
        auth: {
          user: boards.user,
          password: boards.password
        },
        json: true
      }

      r.expects('get').withArgs(requestOpts).yields(null, {
        statusCode: 200
      }, SAMPLE_JIRA_BODY)

      boards.board(function (err, boards) {
        should.not.exist(err)

        boards.should.eql(SAMPLE_JIRA_BODY.values)
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
      _boards.expects('board').yields(null, s)
      _res.expects('send').withArgs(s)

      boards.get(null, res)
      done()
    })
  })
})
