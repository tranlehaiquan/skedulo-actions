const path = require('path')

const fs = require('fs')

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)

const paths = {
  appSrc: resolveApp('src'),
}

const pluginName = 'ConsoleLogOnBuildWebpackPlugin'
function getHoursMinuteSeconds() {
  const d = new Date()
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d
    .getSeconds()
    .toString()
    .padStart(2, '0')}`
}
class ConsoleLogOnBuildWebpackPlugin {
  apply(compiler) {
    compiler.hooks.compile.tap(pluginName, (compilation) => {
      console.log(`${getHoursMinuteSeconds()}: Compiling ...`)
    })

    compiler.hooks.done.tap(pluginName, (compilation) => {
      console.log(`${getHoursMinuteSeconds()}: Compile completed 🙏 🎉`)
    })
  }
}

module.exports = {
  entry: './src/handler.ts',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(ts)$/,
        loader: require.resolve('eslint-loader'),
        enforce: 'pre',
        include: paths.appSrc,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.graphql'],
  },
  plugins: [new ConsoleLogOnBuildWebpackPlugin()],
  output: {
    libraryTarget: 'commonjs2',
    filename: 'handler.js',
    path: path.resolve(__dirname, 'dist'),
  },
}
