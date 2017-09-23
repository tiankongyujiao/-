# webpack
#### webpack概念
webpack 是一个现代 JavaScript 应用程序的模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成少量的 bundle - 通常只有一个，由浏览器加载。在需要引用的地方只需要引用这一个打包的文件即可。  
它的配置文件是很复杂的，但是基本的使用只需要理解四个配置参数：entry, output, loaders, 和 plugins：  
**entry**：告诉webpack项目开始的地方（项目），然后根据依赖关系图得知要打包什么。 （contextual root or the first file to kick off your app）
```
module.exports = {
  entry: './path/to/my/entry/file.js'
};
```
**output**：设置打包后的文件名和文件路径
```
const path = require('path');

module.exports = {
  entry: './path/to/my/entry/file.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js'
  }
};
```
**loader**: webpack把.html,.css,.scss,.jpeg等文件都看成是模块，webpack本身只能解析js，loader就是解析这些模块，使其能够被添加到依赖图里面，并最终在打包文件bundle文件里面。简单说，loader就是为了解析.html,.css,.scss,.jpeg...文件。
loader在配置文件中的两个作用：  
（1）标志哪个文件或者哪些文件需要使用特定的loader解析。  
（2）解析.html,.css,.scss,.jpeg...文件，使其能够被添加到依赖图里面，并最终在打包文件bundle文件里面

```
const path = require('path');

const config = {
  entry: './path/to/my/entry/file.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js'
  },
  module: {
    rules: [
      { 
          test: /\.txt$/, 
          use: 'raw-loader' 
      }
    ]
  }
};

module.exports = config;
```
解释：在遇到.txt文件时，先把它使用raw-loader解析，然后再加入依赖树，最终生成打包bundle文件。
注意添加loader的方法，是在module对象的rules属相里面，而不是直接添加rules

**plugins**: loader是对单个模块文件作用，插件是对打包文件或者编译文件的自定义功能和行为起作用。
在使用plugins之前，必须要require()这个插件，很多插件通过配合选项是可以定制的，可以在一个配置文件中为了不同的目的而多次使用同一个插件，但是必须使用new来调用这个插件。
```
const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const webpack = require('webpack'); //to access built-in plugins
const path = require('path');

const config = {
  entry: './path/to/my/entry/file.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js'
  },
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(), //webpack提供的压缩代码的工具，或者如下使用
    //new webpack.optimize.UglifyJsPlugin({
    //  compress: {
    //    warnings: false
    //  }
    //}),
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};

module.exports = config;
```
webpack提供了很多插件，通常在webpack.config.js中使用插件是直截了当的，但是有的插件的使用还是需要深入研究的。


