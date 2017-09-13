# webpack
#### webpack概念
webpack是现代js的打包工具，当你的项目使用webpack的时候，它会递归的构建一个依赖树，这个依赖树包含了你的应用程序所需要的所有的模块，这些模块会被打包成少数的几个bundles文件，通常只有一个，在需要引用的地方只需要引用这一个打包的文件即可。  
它的配置文件是很复杂的，但是基本的使用只需要理解四个配置参数：entry, output, loaders, 和 plugins：  
**entry**：告诉webpack项目开始的地方（项目），然后根据依赖图得知要打包什么。 （contextual root or the first file to kick off your app）
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
      { test: /\.txt$/, use: 'raw-loader' }
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
    new webpack.optimize.UglifyJsPlugin(),
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};

module.exports = config;
```
webpack提供了很多插件，通常在webpack.config.js中使用插件是直截了当的，但是有的插件的使用还是需要深入研究的。


