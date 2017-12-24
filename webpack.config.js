var webpack = require( 'webpack' )

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
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