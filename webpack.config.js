const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'dev';

const publicPath = (NODE_ENV === 'dev')
  ? 'http://localhost:3000'
  : 'http://goask.club';

const config = {
  entry: {
    mySessions: './src/my-sessions.js',
    myQuestions: './src/my-questions.js',
    myRequests: './src/my-requests.js',
    main: './src/main.js',
    login: './src/login.js',
    registration: './src/registration.js',
    publicSessions: './src/public-sessions.js',
    publicSessionDetails: './src/public-session-details.js',
    registrationSpeaker: './src/registration-speaker.js',
  },
  output: {
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].js',
    publicPath: `${publicPath}/`,
    path: path.join(__dirname, '../goask-main-server/public'),
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
      // {
      //   test: /\.scss$/,
      //   use: [
      //     {
      //       loader: 'style-loader',
      //     },
      //     {
      //       loader: 'css-loader',
      //     },
      //     {
      //       loader: 'sass-loader',
      //       options: {
      //         includePaths: [
      //           path.join(__dirname, 'src'),
      //         ],
      //       },
      //     },
      //   ],
      // },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          // fallback: 'style-loader',
          use: ['css-loader', 'sass-loader'],
        }),
        include: path.join(__dirname, 'src'),
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
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
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  resolveLoader: {
    modules: ['node_modules', 'webpack/loaders'],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'css/[name].css',
      allChunks: true,
    }),
  ],
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
    port: 3000,
    contentBase: path.join(__dirname, 'dist'),
  };
}


if (NODE_ENV === 'prod') {
  config.plugins.push(new UglifyJsPlugin());
}

module.exports = config;
