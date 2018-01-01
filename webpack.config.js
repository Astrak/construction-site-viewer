var webpack = require( 'webpack' )

module.exports = {
  entry: './website/src/index.js',
  output: {
    filename: 'website/bundle.js',
    publicPath: ''
  },
  module: {
    loaders: [
      { 
        test: /\.js/,
        loader: 'babel-loader', 
        query: { 
          compact: true,
          presets: [ 
            [ 'es2015', { modules: false } ]
          ] 
        } 
      }
    ]
  }
}