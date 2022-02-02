module.exports = {
    configureWebpack: {
      devServer: {
        host: 'localhost',
        proxy: {
          '^/h5p': {
            target: 'http://127.0.0.1:8080',
            //  target: 'https://editor-sodix-dev.fwu.de/',
            changeOrigin: true,
          }
        }
      },
    }
  };