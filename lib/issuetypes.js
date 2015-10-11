var request = require('request')
var async = require('async')
var url = require('url')
var util = require('util')

function IssueTypes (options) {
  this.user = options.user
  this.password = options.password
  this.host = options.host
}

IssueTypes.prototype._formatJira = function (issue, callback) {
  callback(null, issue.name)
}

IssueTypes.prototype.issuetype = function (callback) {
  var u = 'https://' + this.host + '/rest/api/latest/issuetype'
  request.get({
    uri: u,
    auth: {
      user: this.user,
      password: this.password
    },
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

    async.map(body, this._formatJira.bind(this), callback)
  }.bind(this))
}

IssueTypes.prototype.get = function (req, res, next) {
  this.issuetype(function (err, issuetypes) {
    if (err && err.statusCode) {
      return res.status(502).send(err)
    } else if (err) {
      return next(err)
    }
    return res.send(issuetypes)
  })
}

module.exports = IssueTypes
