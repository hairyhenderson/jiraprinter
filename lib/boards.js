var request = require('request')
var url = require('url')
var util = require('util')

function Boards (options) {
  this.user = options.user
  this.password = options.password
  this.host = options.host
}

Boards.prototype.board = function (callback) {
  var u = 'https://' + this.host + '/rest/agile/latest/board'
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

    callback(null, body.values)
  })
}

Boards.prototype.get = function (req, res, next) {
  this.board(function (err, boards) {
    if (err && err.statusCode) {
      return res.status(502).send(err)
    } else if (err) {
      return next(err)
    }
    return res.send(boards)
  })
}

module.exports = Boards
