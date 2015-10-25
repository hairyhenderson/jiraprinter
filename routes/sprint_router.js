var Sprints = require('../lib/sprints')

function SprintsRouter (config, router) {
  this.config = config || {}
  this.router = router

  /* eslint-disable */
  var sprints = null
  Object.defineProperties(this, {
    sprints: {
      set: function (s) {
        sprints = s
      },
      get: function () {
        if (!sprints) {
          sprints = new Sprints(this.config)
        }
        return sprints
      }.bind(this)
    }
  })
/* eslint-enable */
}

SprintsRouter.prototype.routes = function () {
  this.router.get('/', this.sprints.get.bind(this.sprints))
  return this.router
}

module.exports = SprintsRouter
