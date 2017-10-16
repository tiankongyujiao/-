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
