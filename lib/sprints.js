var request = require('request')
var util = require('util')
var Resource = require('./resource')

function Sprints (options) {
  this.user = options.user
  this.password = options.password
  this.host = options.host
}

util.inherits(Sprints, Resource)

Sprints.prototype.sprint = function (boardId, callback) {
  var u = this.host + '/rest/agile/latest/board/' + boardId + '/sprint'
  request.get({
    uri: u,
    auth: {
      user: this.user,
      password: this.password
    },
    qs: {
      state: 'active,future'
    },
    json: true
  }, this._resourceResponseHandler(function (body) {
    return body.values
  }, callback))
}

Sprints.prototype.get = function (req, res, next) {
  var boardId = req.query['boardId']
  this.sprint(boardId, this._getHandler(res, next))
}

module.exports = Sprints
