# Hasadna - eKnight Land

This project is the public-facing site of the Open Knowledge Workshop.

The site contains details on any of the open-source project maintained by workshop members that currently require help from
the developers community.

## Adding new projects

To add a new Github project to the site, please edit `eKnightsData.js` and add a new JSON entity that includes:

  * **name** - project name
  * **permalink** - permalink to project website
  * **about** - short descriptive text about the project
  * **status** - the project status
  * **entry_level** - what's the required expertise to participate in this project
  * **discussion_board** - link to project's discussion board
  * **github_repo** - relative name of Github repo (under hasadna namespace)
  * **leaders** - Github user names of project leaders
  * **tags** - list of tags that describe the project

## Requirements

## Installing and running locally

```bash
$ git clone git@github.com:hasadna/hasadna.github.io.git
```
