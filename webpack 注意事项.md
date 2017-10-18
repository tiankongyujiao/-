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

### CommonsChunkPlugin
```
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
module.exports = {
    entry: {
        main: process.cwd()+'/example3/main.js',
        main1: process.cwd()+'/example3/main1.js',
        common1:["jquery"],
        common2:["vue"]
    },
    output: {
        path: process.cwd()+'/dest/example3',
        filename: '[name].js'
    },
    plugins: [
        new CommonsChunkPlugin({
            name: ["chunk",'common1','common2'],//对应于上面的entry的key
            minChunks:2
        })
    ]
};
```
上面的配置就可以把:  
(1) jquery,vue分别打包到一个独立的chunk中，分别为common1.js,common2.js;  
(2) 同时把main1,main的公共业务模块打包到chunk.js中;  
(3) 而其他非公共的业务代码全部保留在main.js和main1.js中。  

```
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
module.exports = {
    entry: {
        main: process.cwd()+'/example6/main.js',
        main1: process.cwd()+'/example6/main1.js',
        jquery:["jquery"]
    },
    output: {
        path: process.cwd()  + '/dest/example6',
        filename: '[name].js'
    },
    plugins: [
        new CommonsChunkPlugin({
            name: "jquery",
            minChunks:2,
            chunks:["main","main1"]
        })
    ]
};
```
上面的配置表示：只有在main.js和main1.js中都引用的模块才会被打包的到公共模块（这里即jquery.js） 

### webpack-dev-server
webpack-dev-server支持两种方式来刷新页面：    
（1）iframe模式（页面放在iframe中，当发生改变时重载）    
（2）inline模式 (将webpack-dev-sever的客户端入口添加到包(bundle)中)    
我们经常使用的是第二种。  
两种模式都支持热模块替换(Hot Module Replacement).**热模块替换的好处是只替换更新的部分,而不是页面重载.**
**iframe模式**
使用这种模式不需要额外的配置,只需要以下面这种URL格式访问即可  
http://«host»:«port»/webpack-dev-server/«path»  
例如:http://localhost:8080/webpack-dev-server/index.html  
**inline模式**
inline模式下我们访问的URL不用发生变化,启用这种模式分两种情况:    
a.  当以命令行启动webpack-dev-server时：  
    在命令行中添加--inline命令  
    或者在webpack.config.js中添加devServer:{inline:true}    
    
b.  当以Node.js API启动webpack-dev-server时  
    由于**webpack-dev-server的配置中无inline选项**,我们需要添加webpack-dev-server/client?http://«path»:«port»/到webpack配置的entry入口点中.  
    将<script src="http://localhost:8080/webpack-dev-server.js"></script>添加到html文件中  
```
var config = require("./webpack.config.js");
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

config.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/");
var compiler = webpack(config);
var server = new WebpackDevServer(compiler, {
    contentBase:'build/',
    publicPath: "/assets/"
});
server.listen(8080);
```
在Node中运行上面的代码即可。

注意：**webpack配置中的devSever配置项只对在命令行模式有效。**


