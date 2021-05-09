# turbo_modal_bootstrap

## Setup

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
mkdir app/javascript/channgels/stylesheets
```

create application.scss with bootstrap and other imports/overrides.

Adjust views/layouts/application.html.erb to include css/js files. (see file for details)

At end of app/javascript/packs/application.js, add:
```
import "bootstrap"
import "./application"
import "stylesheets/application"
```

Create Posts controller, model, and basic scaffold
