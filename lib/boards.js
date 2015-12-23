var request = require('request')
var util = require('util')
var Resource = require('./resource')

function Boards (options) {
  this.user = options.user
  this.password = options.password
  this.host = options.host
}

util.inherits(Boards, Resource)

Boards.prototype.board = function (callback) {
  var u = 'https://' + this.host + '/rest/agile/latest/board'
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
