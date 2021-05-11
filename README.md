# turbo_modal_bootstrap

Here's my take on a basic CRUD setup using Turbo and Stimulus, with Bootstrap modals. It's based
on Doug Stull's excellent tutorial on the subject (see https://dev.to/dstull/how-to-use-modals-with-forms-in-rails-using-turbo-14n7), except with Bootstrap 5 instead of TailwindCSS.

## Setup

Clone repo, then go into app directory and run:
```
bundle
yarn
rails db:setup
rails s
```
Navigate to http://localhost:3000

## Project Setup (starting from scratch)

```
rails new turbo_modal_bootstrap
```

set .ruby-version = 3.0.0 (also gemfile), .node-version = 14.13.1 (using rbenv, nodenv)

```
rails hotwire:install
yarn add bootstrap
yarn add @popperjs/core
```

adjust  config/webpack/environment.js (basically, add popper)

```
mkdir app/javascript/channels/stylesheets
```

create application.scss with bootstrap and other imports/overrides.

Adjust views/layouts/application.html.erb to include css/js files. (see file for details)

At end of app/javascript/packs/application.js, add:
```
import "bootstrap"
import "./application"
import "stylesheets/application"
```

Create Posts controller, model, basic scaffold, etc...
