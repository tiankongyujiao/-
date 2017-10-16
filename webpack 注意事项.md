1.使用webpack打包image时，有html-loader,file-loader,url-loader等众多插件，当使用url-loader时注意不要加file-loader，否则图片不显示。  
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
