module.exports = {
  css: {
    requireModuleExtension: true
  },
  configureWebpack: {
    resolve: {
      mainFields: ['main', 'browser']
    }
  }
}