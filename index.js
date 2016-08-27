#!/usr/bin/env node
var config = require('commander')
var express = require('express')
var IssueTypeRouter = require('./routes/issuetype_router')
var IssueRouter = require('./routes/issue_router')
var FilterRouter = require('./routes/filter_router')
var BoardRouter = require('./routes/board_router')
var SprintRouter = require('./routes/sprint_router')
var app = express()

config
  .version(require('./package.json').version)
  .option('-u, --user [username]', 'The JIRA username ($JIRA_USER)', process.env.JIRA_USER)
  .option('--password [password]', 'The JIRA password ($JIRA_PASS)', process.env.JIRA_PASS)
  .option('-h, --host [host]', 'The JIRA hostname ($JIRA_HOST)', process.env.JIRA_HOST)
  .parse(process.argv)

function validateOpts (config) {
  var errors = 0
  if (!config.user) {
    console.error('ERROR: Username required. Use -u/--user, or set $JIRA_USER')
    errors++
  }
  if (!config.password) {
    console.error('ERROR: Password required. Set $JIRA_PASS (or use --password)')
    errors++
  }
  if (!config.host) {
    console.error('ERROR: JIRA hostname required. Use -h/--host, or set $JIRA_HOST')
    errors++
  }
  var regex = /^http[s]?:\/\//
  if (config.host.match(regex) === null) {
    console.log('WARN: Defaulting to https:// for %s', config.host)
    config.host = 'https://' + config.host
  }
  if (errors) {
    process.exit(errors)
  }
}

validateOpts(config)

var issuetypeRouter = new IssueTypeRouter(config, express.Router())
var issueRouter = new IssueRouter(config, express.Router())
var filterRouter = new FilterRouter(config, express.Router())
var boardRouter = new BoardRouter(config, express.Router())
var sprintRouter = new SprintRouter(config, express.Router())

app.use('/issuetypes', issuetypeRouter.routes())
app.use('/issues', issueRouter.routes())
app.use('/filters', filterRouter.routes())
app.use('/boards', boardRouter.routes())
app.use('/sprints', sprintRouter.routes())

app.use(express.static('public'))

var port = process.env.PORT || 3000

if (process.env.NODE_ENV !== 'test') {
  var server = app.listen(port, function () {
    var host = server.address().address
    var port = server.address().port

    console.log('jiraprinter listening at %s:%s', host, port)
  })
}

module.exports = app
