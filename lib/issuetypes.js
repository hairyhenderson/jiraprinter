var request = require('request')
var async = require('async')
var util = require('util')
var Resource = require('./resource')

function IssueTypes (options) {
  this.user = options.user
  this.password = options.password
  this.host = options.host
}

util.inherits(IssueTypes, Resource)

IssueTypes.prototype._formatJira = function (issue, callback) {
  callback(null, issue.name)
}

IssueTypes.prototype.issuetype = function (callback) {
  var u = this.host + '/rest/api/latest/issuetype'
  request.get({
    uri: u,
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
      async.map(body, this._formatJira.bind(this), callback)
    }.bind(this))
  }.bind(this))
}

IssueTypes.prototype.get = function (req, res, next) {
  this.issuetype(this._getHandler(res, next))
}

module.exports = IssueTypes
