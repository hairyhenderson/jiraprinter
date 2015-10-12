[![Build Status][circleci-image]][circleci-url]
[![Code Coverage][coverage-image]][coverage-url]
[![Code Climate][climate-image]][climate-url]
[![Dependency Status][gemnasium-image]][gemnasium-url]
[![Current Version][npm-image]][npm-url]
[![JS Standard Style][js-standard-image]][js-standard-url]

# jiraprinter

> _As a JIRA user, I want to be able to print out my current sprint's stories,
so that I can post them on a physical Kanban board._

## Background

While JIRA has a UI for tracking and interacting with the current sprint's stories, teams easily become distracted while using it together &mdash; the group ends up huddled around a laptop arguing about the best way to filter the search query, or getting lost in unimportant details. Sometimes low-tech solutions can be the most powerful: physical cards representing the stories.

This is a very simple app that queries JIRA to list all of the stories in the team's current sprint, and provide an HTML page with print-optimized CSS rules.

Each story is printed out as a half-page (US Letter) card, with the Story number, the summary, and the priority. As a bonus, a QR code is provided which will take you directly to the story from your smartphone.

## Usage

### with Docker

You can run jiraprinter in Docker:

```console
$ docker run -d -p 8080:80 -e JIRA_PASS -e JIRA_USER=me -e JIRA_HOST=myjira.example.com hairyhenderson/jiraprinter
```

Or, you can use `npm` to install it:

### install

```console
$ npm install -g jiraprinter
```

### run it!

```console
$ jiraprinter --help

  Usage: jiraprinter [options]

  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -u, --user [username]    The JIRA username ($JIRA_USER)
    --password [password]    The JIRA password ($JIRA_PASS)
    -h, --host [host]        The JIRA hostname ($JIRA_HOST)
$ jiraprinter -h myjira.example.com -u me
```

_You should probably only ever use `$JIRA_PASS`, and not the `--password` flag!_

Now, connect with your browser at http://localhost:3000, select your project, and when the UI's fully populated with your stories, print the page!

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2015 Dave Henderson

[circleci-image]: https://img.shields.io/circleci/project/hairyhenderson/jiraprinter.svg?style=flat
[circleci-url]: https://circleci.com/gh/hairyhenderson/jiraprinter

[coverage-image]: https://img.shields.io/codeclimate/coverage/github/hairyhenderson/jiraprinter.svg?style=flat
[coverage-url]: https://codeclimate.com/github/hairyhenderson/jiraprinter

[climate-image]: https://img.shields.io/codeclimate/github/hairyhenderson/jiraprinter.svg?style=flat
[climate-url]: https://codeclimate.com/github/hairyhenderson/jiraprinter

[gemnasium-image]: https://img.shields.io/gemnasium/hairyhenderson/jiraprinter.svg?style=flat
[gemnasium-url]: https://gemnasium.com/hairyhenderson/jiraprinter

[npm-image]: https://img.shields.io/npm/v/jiraprinter.svg?style=flat
[npm-url]: https://npmjs.org/package/jiraprinter

[waffle-ready-image]: https://badge.waffle.io/hairyhenderson/jiraprinter.svg?label=ready&title=Ready
[waffle-progress-image]: https://badge.waffle.io/hairyhenderson/jiraprinter.svg?label=in+progress&title=In+Progress
[waffle-url]: https://waffle.io/hairyhenderson/jiraprinter

[js-standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat
[js-standard-url]: http://standardjs.com/
