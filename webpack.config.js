const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'dev';

const publicPath = (NODE_ENV === 'dev')
  ? 'http://localhost:8080'
  : 'http://www.goask.club';

const config = {
  entry: {
    login: './src/login.js',
    registration: './src/registration.js',
    createSpeaker: './src/create-speaker.js',
  },
  output: {
    filename: 'js/[name].js',
    path: path.join(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$|\.scss$/,
        exclude: /node_modules/,
        loader: 'set-public-path',
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          publicPath,
        },
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [
                path.join(__dirname, 'src'),
              ],
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'img',
              publicPath: `${publicPath}/img/`,
            },
          },
        ],
      },
    ],
  },
  resolveLoader: {
    modules: ['node_modules', 'webpack/loaders'],
  },
  resolve: {
    modules: [
      'src',
      'node_modules',
    ],
    extensions: ['.js', '.css'],
  },
};

if (NODE_ENV === 'dev') {
  config.watch = true;
  config.devtool = 'inline-cheap-module-source-map';
  config.devServer = {
    inline: true,
    port: 8080,
    contentBase: path.join(__dirname, 'dist'),
  };
}


if (NODE_ENV === 'prod') {
  config.plugins = [
    new UglifyJsPlugin(),
  ];
}

module.exports = config;
