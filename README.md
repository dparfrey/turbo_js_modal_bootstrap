# turbo_modal_bootstrap

This is a "traditional" Stimulus Javascript implementation of a basic CRUD page with Bootstrap 5 modals. It's still using Turbo, but not Turbo Streams.

I hope this helps someone.

## History
I'd been trying to use Turbo/Stimulus with Bootstrap 5 to set up a basic CRUD page. Basically,
there's a list of records showing. You can edit each record through a modal popup and delete
it with a confirmation modal. There's also a "New" button somewhere on the page.

I started from a tutorial by Doug Stull (see https://dev.to/dstull/how-to-use-modals-with-forms-in-rails-using-turbo-14n7). He used TailwindCSS, so I converted it to
Bootstrap 5. The result can be seen at https://github.com/dparfrey/turbo_modal_bootstrap.

I had two problems with this solution. First, adding Javascript validation made the whole thing
fail. It caused the post#update call to return an HTML response instead of TURBO_STREAM. There
are work-arounds, but... The second problem is, the whole thing seems too "magical". Honestly,
I like Rails, but I don't think the Turbo Stream stuff is very intuitive. It made me want to see
how this would look with some regular Stimulus Javascript making AJAX calls.

And... I like it a lot better. The result is a lot of Javascript, but I think it's easier to set
up and understand.

## Using Javascript instead of Turbo
The result is a Stimulus "crud controller" for the page. Most of the code is in `crudMixin.js`, making
it easy to create your own custom controller if you want to customize some of the actions.

The basic crud actions are covered in `crud_controller.js`. I'm using "regular"
`data-` attributes for most of the settings, since I have a single controller
for the entire group. I tried using multiple controllers, one for each record, but the event handlers I have to define to make things work got out of hand, causing duplicate processing. Also, I'm opening and closing Bootstrap modals with Javascript to be able to inject my own logic easier.

I'm using http://github.com/cferdinandi/bouncer for my validations.
It works well, but needs an event handler to be able to intercept submits. Without it, Bouncer tries to submit the form and Turbo ignores it.

I've included `crud_disable_controller.js` as an example of overriding the
delete/destroy method to update the row instead of deleting it. I use it to
show disabled records (typically grayed out).

Finally, if you use crud_controller more than once on a page, change the id
of the temp container div so each controller has its own temp area. See
`crud_disable_controller.js` to see how it's done.

## Try it out

Clone the repo, then go into the app directory and run:
```
bundle
yarn
rails db:setup
rails s
```
Navigate to http://localhost:3000/posts

## How to set up a project (starting from scratch)
```
rails new turbo_modal_bootstrap
```

set .ruby-version = 3.0.0 (also gemfile), .node-version = 14.13.1 (if using rbenv, nodenv)

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
