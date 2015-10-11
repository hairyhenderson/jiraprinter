#!/usr/bin/env node
var config = require('commander')
var express = require('express')
var StoryRouter = require('./routes/story_router')
var app = express()

config
  .version(require('./package.json').version)
  .option('-p, --project <project>', 'The JIRA project name')
  .option('-t, --type [type]', 'The issue type to list [Story]', 'Story')
  .option('-u, --user [username]', 'The JIRA username ($USER)', process.env.USER)
  .option('--password [password]', 'The JIRA password ($JIRA_PASS)', process.env.JIRA_PASS)
  .option('-h, --host <host>', 'The JIRA hostname')
  .parse(process.argv)

var story_router = new StoryRouter(config, express.Router())

app.use('/stories', story_router.routes())

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
