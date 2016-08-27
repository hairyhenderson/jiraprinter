var Filter = require('../lib/filters')

function FilterRouter (config, router) {
  this.config = config || {}
  this.router = router

  var filters = null
  Object.defineProperties(this, {
    filters: {
      set: function (s) {
        filters = s
      },
      get: function () {
        if (!filters) {
          filters = new Filter(this.config)
        }
        return filters
      }.bind(this)
    }
  })
}

FilterRouter.prototype.routes = function () {
  this.router.get('/', this.filters.get.bind(this.filters))
  return this.router
}

module.exports = FilterRouter
