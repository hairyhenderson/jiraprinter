var _ = require('lodash')
var request = require('request')
var async = require('async')
var util = require('util')
var Resource = require('./resource')

var DEFAULT_ISSUETYPE = 'Story'

function Issues (options) {
  this.user = options.user
  this.password = options.password
  this.host = options.host
}

util.inherits(Issues, Resource)

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
    this._handleResponse(err, res, body, function (err, body) {
      if (err) {
        return callback(err)
      }
      async.map(body.issues, this._formatJira.bind(this), callback)
    }.bind(this))
  }.bind(this))
}

Issues.prototype.get = function (req, res, next) {
  var issuetype = _.get(req, 'query.issuetype') || DEFAULT_ISSUETYPE
  var board = _.get(req, 'query.board')
  if (!board) {
    return res.send([])
  }
  var sprint = _.get(req, 'query.sprint', 'openSprints()')

  this.search(issuetype, board, sprint, this._getHandler(res, next))
}

module.exports = Issues
