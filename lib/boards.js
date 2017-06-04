var request = require('request')
var util = require('util')
var Resource = require('./resource')

function Boards (options) {
  this.user = options.user
  this.password = options.password
  this.host = options.host
  this.boardName = options.boardName
}

util.inherits(Boards, Resource)

Boards.prototype.board = function (callback) {
  var u = this.host + '/rest/agile/latest/board'
  if (this.boardName) {
    u = u + '?name=' + this.boardName
  }
  request.get({
    uri: u,
    auth: {
      user: this.user,
      password: this.password
    },
    json: true
  }, this._resourceResponseHandler(function (body) {
    return body.values
  }, callback))
}

Boards.prototype.get = function (req, res, next) {
  this.board(this._getHandler(res, next))
}

module.exports = Boards
