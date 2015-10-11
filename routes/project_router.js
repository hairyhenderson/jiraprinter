var Projects = require('../lib/projects')

function ProjectsRouter (config, router) {
  this.config = config || {}
  this.router = router

  /* eslint-disable */
  var projects = null
  Object.defineProperties(this, {
    projects: {
      set: function (s) {
        projects = s
      },
      get: function () {
        if (!projects) {
          projects = new Projects(this.config)
        }
        return projects
      }.bind(this)
    }
  })
/* eslint-enable */
}

ProjectsRouter.prototype.routes = function () {
  this.router.get('/', this.projects.get.bind(this.projects))
  return this.router
}

module.exports = ProjectsRouter
