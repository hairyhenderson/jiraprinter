var request = require('request')
var url = require('url')
var util = require('util')

function Sprints (options) {
  this.user = options.user
  this.password = options.password
  this.host = options.host
}

Sprints.prototype.sprint = function (boardId, callback) {
  var u = 'https://' + this.host + '/rest/agile/latest/board/' + boardId + '/sprint'
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

Sprints.prototype.get = function (req, res, next) {
  var boardId = req.query['boardId']
  this.sprint(boardId, function (err, sprints) {
    if (err && err.statusCode) {
      return res.status(502).send(err)
    } else if (err) {
      return next(err)
    }
    return res.send(sprints)
  })
}

module.exports = Sprints
