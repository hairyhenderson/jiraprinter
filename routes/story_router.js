// var debug = require('debug')(require('../package.json').name + ':routes:StoryRouter')
var Stories = require('../lib/stories')

function StoryRouter (config, router) {
  this.config = config || {}
  this.router = router

  // Here be dragons 🐉🐲
  // We just want to lazy-load the /stories handler to make testing a bit easier
  /* eslint-disable */
  var stories = null
  Object.defineProperties(this, {
    stories: {
      set: function (s) {
        stories = s
      },
      get: function () {
        if (!stories) {
          stories = new Stories(this.config)
        }
        return stories
      }.bind(this)
    }
  })
/* eslint-enable */
}

StoryRouter.prototype.routes = function () {
  this.router.get('/', this.stories.get.bind(this.stories))
  return this.router
}

module.exports = StoryRouter
