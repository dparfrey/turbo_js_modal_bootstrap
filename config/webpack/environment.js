const { environment } = require('@rails/webpacker')

const webpack = require("webpack")
environment.plugins.append("Provide", new webpack.ProvidePlugin({
  Bouncer: '../src/bouncer',
  Popper: ['popper.js', 'default']
}))

module.exports = environment
