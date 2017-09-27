### 使用source-map
在webpack.config.js中加入一个配置选项：
```
devtool:'inline-source-map',
```
配合source-map使用的还需要source-map-loader，首先安装source-map-loader:
```
npm install source-map-loader --save-dev
```
加入该loader到配置文件webpack.config.js中：
```
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre"
      }
    ]
  }
};
```
最后npm run build 你的项目名称，就完成了此应用，你会发现js报错的时候具体到了具体的文件具体的行号，而不是只是提示最后一个总的打包文件出错，也没有行号，不至于让人摸不着头脑，不知道哪里报错，这就是source-map的作用。
