var _ = require('lodash')
var request = require('request')
var async = require('async')
var url = require('url')
var util = require('util')

var DEFAULT_ISSUETYPE = 'Story'

function Issues (options) {
  this.user = options.user
  this.password = options.password
  this.host = options.host
}

Issues.prototype._buildQuery = function (issuetype, sprint) {
  var sprintQuery
  if (_.endsWith(sprint, '()')) {
    sprintQuery = 'sprint in ' + sprint
  } else {
    sprintQuery = 'sprint = ' + sprint
  }
  return 'type = "' + issuetype + '" AND ' + sprintQuery
}

Issues.prototype._formatJira = function (issue, callback) {
  callback(null, {
    name: issue.fields.issuetype.name,
    key: issue.key,
    priority: issue.fields.priority.name,
    summary: issue.fields.summary,
    status: issue.fields.status.name,
    url: 'https://' + this.host + '/browse/' + issue.key
  })
}

Issues.prototype._searchOpts = function (issuetype, sprint) {
  return {
    jql: this._buildQuery(issuetype, sprint),
    fields: [
      'issuetype',
      'priority',
      'summary',
      'status'
    ]
  }
}

Issues.prototype.search = function (issuetype, board, sprint, callback) {
  var u = 'https://' + this.host + '/rest/agile/latest/board/' + board + '/issue'
  request.get({
    uri: u,
    auth: {
      user: this.user,
      password: this.password
    },
    qs: this._searchOpts(issuetype, sprint),
    json: true
  }, function (err, res, body) {
    if (err) {
      console.error(err)
      return callback(err)
    }
    if (res.statusCode > 399) {
      var msg = util.format('got status %s while %sing to %s', res.statusCode, res.request.method, url.format(res.request.uri))
      console.error(msg)
      return callback({
        message: msg,
        statusCode: res.statusCode,
        method: res.request.method,
        body: body
      })
    }

    async.map(body.issues, this._formatJira.bind(this), callback)
  }.bind(this))
}

Issues.prototype.get = function (req, res, next) {
  var issuetype = _.get(req, 'query.issuetype') || DEFAULT_ISSUETYPE
  var board = _.get(req, 'query.board')
  if (!board) {
    return res.send([])
  }
  var sprint = _.get(req, 'query.sprint', 'openSprints()')

  this.search(issuetype, board, sprint, function (err, issues) {
    if (err && err.statusCode) {
      return res.status(502).send(err)
    } else if (err) {
      return next(err)
    }
    return res.send(issues)
  })
}

module.exports = Issues
