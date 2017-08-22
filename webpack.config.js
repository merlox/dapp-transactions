const path = require('path')
const htmlPlugin = require('html-webpack-plugin')

module.exports = {
   entry: path.join(__dirname, 'src/js', 'index.js'),
   output: {
      path: path.join(__dirname, 'dist'),
      filename: 'build.js'
   },
   module: {
      loaders: [{
         test: /\.styl$/,
         use: ['style-loader', 'css-loader', 'stylus-loader'],
         include: /src/
      }, {
         loader: 'babel-loader',
         test: /\.jsx?$/,
         exclude: /node_modules/,
         query: {
            presets: ['es2015', 'react', 'stage-2']
         }
      }, {
         loader: 'json-loader',
         test: /\.json$/
      }]
   },
   plugins: [new htmlPlugin({
      title: "Dapp for descentralized transactions",
      template: './src/templates/index.ejs',
      hash: true
   })]
}
