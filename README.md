# turbo_modal_bootstrap



## To Do
* Move more stuff to crudMixin
* Animations?
* Ajax Add at top of list

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
yarn add bootstrap@next
yarn add @popperjs/core
```

adjust  config/webpack/environment.js (basically, add popper)

```
mkdir app/javascript/stylesheets
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
