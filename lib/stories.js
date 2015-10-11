// var _ = require('lodash')
var request = require('request')
var async = require('async')
var url = require('url')
var util = require('util')

function Stories (options) {
  this.project = options.project
  this.type = options.type
  this.user = options.user
  this.password = options.password
  this.host = options.host
}

Stories.prototype._buildQuery = function () {
  return 'project = "' + this.project + '" AND type = "' + this.type + '" AND sprint in openSprints()'
}

Stories.prototype._formatJira = function (issue, callback) {
  callback(null, {
    name: issue.fields.issuetype.name,
    key: issue.key,
    priority: issue.fields.priority.name,
    summary: issue.fields.summary,
    status: issue.fields.status.name,
    url: 'https://' + this.host + '/browse/' + issue.key
  })
}

Stories.prototype.search = function (callback) {
  var u = 'https://' + this.host + '/rest/api/latest/search'
  request.post({
    uri: u,
    auth: {
      user: this.user,
      password: this.password
    },
    json: {
      jql: this._buildQuery()
    }
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

Stories.prototype.get = function (req, res, next) {
  this.search(function (err, stories) {
    if (err && err.statusCode) {
      return res.status(502).send(err)
    } else if (err) {
      return next(err)
    }
    return res.send(stories)
  })
}

module.exports = Stories
