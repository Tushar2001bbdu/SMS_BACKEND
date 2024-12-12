<<<<<<< HEAD
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  externals: [nodeExternals()], // Exclude node_modules from the bundle
  entry: './server.js', // Path to your Lambda function entry point
  output: {
    path: path.join(__dirname, '.webpack'),
    filename: 'server.js', // Output bundle file
  },
  optimization: {
    minimize: true, // Minify the output bundle
  },
};
=======
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  externals: [nodeExternals()], // Exclude node_modules from the bundle
  entry: './server.js', // Path to your Lambda function entry point
  output: {
    path: path.join(__dirname, '.webpack'),
    filename: 'server.js', // Output bundle file
  },
  optimization: {
    minimize: true, // Minify the output bundle
  },
};
>>>>>>> 1b2ec40261dc6e42e4372e866a8a713f97c16606
