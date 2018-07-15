
const withSass = require('@zeit/next-sass')
const webpack = require('webpack');

require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : process.env.NODE_ENV === 'develop' ? '.env.develop' : '.env'
});

module.exports = {
  webpack: config => {
    const env = Object.keys(process.env).reduce((acc, curr) => {
      acc[`process.env.${curr}`] = JSON.stringify(process.env[curr]);
      return acc;
    }, {});

    config.plugins.push(new webpack.DefinePlugin(env));

    return config;
  }
};
