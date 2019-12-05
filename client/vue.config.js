const path = require('path');

module.exports = {
  publicPath: process.env.NODE_ENV === 'ancient-sands-23695.herokuapp.com/',
  transpileDependencies: [
    'vuetify',
  ],
  outputDir: path.resolve(__dirname, '../public'),
  devServer: {
	proxy: {
		'/api': {
			target: 'http://localhost:4000'
		}
	}
  }
};
