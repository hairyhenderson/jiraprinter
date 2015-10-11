#!/usr/bin/env node
var config = require('commander')
var express = require('express')
var IssueTypeRouter = require('./routes/issuetype_router')
var IssueRouter = require('./routes/issue_router')
var app = express()

config
  .version(require('./package.json').version)
  .option('-p, --project <project>', 'The JIRA project name')
  .option('-u, --user [username]', 'The JIRA username ($USER)', process.env.USER)
  .option('--password [password]', 'The JIRA password ($JIRA_PASS)', process.env.JIRA_PASS)
  .option('-h, --host <host>', 'The JIRA hostname')
  .parse(process.argv)

var issuetype_router = new IssueTypeRouter(config, express.Router())
var issue_router = new IssueRouter(config, express.Router())

app.use('/issuetypes', issuetype_router.routes())
app.use('/issues', issue_router.routes())

app.use(express.static('public'))

var port = process.env.PORT || 3000

if (process.env.NODE_ENV !== 'test') {
  var server = app.listen(port, function () {
    var host = server.address().address
    var port = server.address().port

    console.log('jiraprinter listening at http://%s:%s', host, port)
  })
}

module.exports = app
