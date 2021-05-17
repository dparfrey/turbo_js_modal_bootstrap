// Load all the js files within this directory and all subdirectories.

const jsFiles = require.context('.', true, /\.js$/)
jsFiles.keys().forEach(jsFiles)
