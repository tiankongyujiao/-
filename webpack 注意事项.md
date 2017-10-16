### 1.使用webpack打包image时，有html-loader,file-loader,url-loader等众多插件，当使用url-loader时注意不要加file-loader，否则图片不显示。  
```
{
  test: /\.(png|svg|jpeg|jpg|gif)$/,
  use: [
    {
      loader: 'url-loader?limit=8&name=[hash:8].[name].[ext]'
      //注意url-loader不能和file-loader一起使用，如果一起使用会发生冲突，看不到图片
    }

  ]
}
```
或者使用：
```
{
  test: /\.(png|svg|jpeg|jpg|gif)$/,
  use: [
    {
      loader:'file-loader'
    }
  ]
}
```
file-loader 和 url-loader 可以接收并加载任何文件，然后将其输出到构建目录。这就是说，我们可以将它们用于任何类型的文件，包括字体。
### 2.怎么理解webpack中的output.filename 和output.chunkFilename
filename应该比较好理解，就是对应于entry里面生成出来的文件名。比如：  
```
{
    entry: {
        "index": "pages/index.jsx"
    },
    output: {
        filename: "[name].min.js",
        chunkFilename: "[name].min.js"
    }
}
```
生成出来的文件名为index.min.js。  
基本上都是在require.ensure去加载模块的时候才会出现chunkFileName，个人理解是cmd和amd异步加载，而且没有给入口文件时，会生成了no-name的chunk，所以你看到的例子，chunkFileName一般都会是[id].[chunkhash].js,也就是这种chunk的命名一般都会是0.a5898fnub6.js.也可以是[name].js，如：
```
output: {
  path: __dirname + "/public",//打包后的文件存放的地方
  filename: "bundle.js",//打包后输出文件的文件名
  chunkFilename: "[name].js" 
}
```
```
require.ensure(['./Greeter.js'], function(require) {
    var greeter = require('./Greeter.js');
    document.querySelector("#root").appendChild(greeter());
},'ensure'); //ensure是打包后的bundle文件名字
```
#### require使用：
```
require.ensure(dependencies: String[], callback: function(require), chunkName: String)
```
依赖 dependencies  
这是一个字符串数组，通过这个参数，在所有的回调函数的代码被执行前，我们可以将所有需要用到的模块进行声明。

回调 callback  
当所有的依赖都加载完成后，webpack会执行这个回调函数。require 对象的一个实现会作为一个参数传递给这个回调函数。因此，我们可以进一步 require() 依赖和其它模块提供下一步的执行。

chunk名称 chunkName  
chunkName 是提供给这个特定的 require.ensure() 的 chunk 的名称。通过提供 require.ensure() 不同执行点相同的名称，我们可以保证所有的依赖都会一起放进相同的 文件束(bundle)。
