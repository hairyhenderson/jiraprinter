var request = require('request')
var util = require('util')
var Resource = require('./resource')

function Filters (options) {
  this.user = options.user
  this.password = options.password
  this.host = options.host
}

util.inherits(Filters, Resource)

Filters.prototype.filter = function (callback) {
  var u = this.host + '/rest/api/latest/filter/favourite'
  request.get({
    uri: u,
    auth: {
      user: this.user,
      password: this.password
    },
    json: true
  }, this._resourceResponseHandler(function (body) {
    return body
  }, callback))
}

Filters.prototype.get = function (req, res, next) {
  this.filter(this._getHandler(res, next))
}

module.exports = Filters
