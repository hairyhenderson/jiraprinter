# jiraprinter

> _As a JIRA user, I want to be able to print out my current sprint's stories,
so that I can post them on a physical Kanban board._

## Background

While JIRA has a UI for tracking and interacting with the current sprint's stories, teams easily become distracted while using it together &mdash; the group ends up huddled around a laptop arguing about the best way to filter the search query, or getting lost in unimportant details. Sometimes low-tech solutions can be the most powerful: physical cards representing the stories.

This is a very simple app that queries JIRA to list all of the stories in the team's current sprint, and provide an HTML page with print-optimized CSS rules.

Each story is printed out as a half-page (US Letter) card, with the Story number, the summary, and the priority. As a bonus, a QR code is provided which will take you directly to the story from your smartphone.

## Usage

### configure it

You need to provide your JIRA instance's URL, as well as a username & password to connect as.

Edit `index.js` file and set your `host`, `username`, and `password` parameters.

### install it
```console
$ npm install
```

### run it!

```console
$ npm start
```

Now, connect with your browser at http://localhost:3000, and when the UI's fully populated with your stories, print the page!

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2015 Dave Henderson
