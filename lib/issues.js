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
  this.fieldOverrides = options.fieldOverrides
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

Issues.prototype._addEstimate = function (board, issue, callback) {
  var u = this.host + '/rest/agile/latest/issue/' + issue.key + '/estimation'
  request.get({
    uri: u,
    auth: {
      user: this.user,
      password: this.password
    },
    qs: {
      boardId: board
    },
    json: true
  }, function (err, res, body) {
    if (err) {
      return callback(err)
    }
    issue.estimation = body.value
    return this._formatJira(issue, callback)
  }.bind(this))
}

Issues.prototype._formatJira = function (issue, callback) {
  callback(null, {
    name: _.get(issue, this.fieldOverrides.name, issue.fields.issuetype.name),
    key: _.get(issue, this.fieldOverrides.key, issue.key),
    priority: _.get(issue, this.fieldOverrides.priority, issue.fields.priority.name),
    summary: _.get(issue, this.fieldOverrides.summary, issue.fields.summary),
    status: _.get(issue, this.fieldOverrides.status, issue.fields.status.name),
    estimation: _.get(issue, this.fieldOverrides.estimation, issue.estimation),
    url: _.get(issue, this.fieldOverrides.url, this.host + '/browse/' + issue.key)
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

Issues.prototype.filter = function (jql, callback) {
  var u = this.host + '/rest/api/latest/search'
  request.get({
    uri: u,
    qs: {
      jql: jql
    },
    auth: {
      user: this.user,
      password: this.password
    },
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

Issues.prototype.search = function (issuetype, board, sprint, callback) {
  var u = this.host + '/rest/agile/latest/board/' + board + '/issue'
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
      var issues = (body) ? body.issues : {}
      async.map(issues, this._addEstimate.bind(this, board), callback)
    }.bind(this))
  }.bind(this))
}

Issues.prototype.get = function (req, res, next) {
  var jql = _.get(req, 'query.jql')
  if (jql) {
    this.filter(jql, this._getHandler(res, next))
  } else {
    var issuetype = _.get(req, 'query.issuetype') || DEFAULT_ISSUETYPE
    var board = _.get(req, 'query.board')
    if (!board) {
      return res.send([])
    }
    var sprint = _.get(req, 'query.sprint', 'openSprints()')
    this.search(issuetype, board, sprint, this._getHandler(res, next))
  }
}

module.exports = Issues
