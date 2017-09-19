### 1.browser-sync
```
// require 加载 browser-sync 模块
var bs = require("browser-sync").create(); //创建Browsersync实例，可以加一个name参数，用于检索的标识。
// 创建一个命名实例
// var bs = require("browser-sync").create('My server');

// .init 启动服务器
bs.init({
    server: "./app"
});

// 现在请BS，而不是方法
// 主Browsersync模块出口
bs.reload("*.html");
```
(1) .create( name )  创建Browsersync实例  
```
// 创建一个未命名的实例
var bs = require("browser-sync").create();

// 创建一个命名实例
var bs = require("browser-sync").create('My server');


// 创建多个
var bs1 = require("browser-sync").create('Server 1');
var bs2 = require("browser-sync").create('Server 2');
```
(2) .get(name)
```
// 在一个文件中创建一个命名实例... 
var bs = require("browser-sync").create('My Server');

// 初始化Browsersync服务器
bs.init({
    server: true
});

// 现在，获取另一个实例。 
var bs = require("browser-sync").get('My server');

// 并调用它的任何方法。 
bs.watch('*.html').on('change', bs.reload);
```
(3) .init(config,cb)
启动Browsersync服务。这将启动一个服务器，代理服务器或静态服务器，这取决于你实际需要。
config配置参数：  
```
browserSync.init({
    // 从应用程序目录中提供文件，指定特定文件名为索引
    server: {
        baseDir:"./",
          index: index.html"
    },
    open:false // 决定Browsersync启动时自动打开的网址,默认为本地
});
```
cb回调函数。  
(4) .reload(arg)
该 reload 方法会通知所有的浏览器相关文件被改动，要么导致浏览器刷新，要么注入文件，实时更新改动。
argv: Type: String | Array | Object [optional]  
```
// 浏览器重载
bs.reload();

// 单个文件
bs.reload("styles.css");

// 多个文件
bs.reload(["styles.css", "ie.css"]);

// 在2.6.0里 - 通配符来重新加载所有的CSS文件 
bs.reload("*.css");
```
(5) .watch( patterns, opts, fn )
单个文件监听。使用此连同Browsersync创建自己的，最小的构建系统。
patterns:需要监听的文件; opts:选择要传递给Chokidar对象的参数; fn:每个事件的回调函数。
```
// 创建一个Browsersync实例 
var bs = require("browser-sync").create();

// 监听HTML更改事件并重新加载
bs.watch("*.html").on("change", bs.reload);

// 提供一个回调来捕获所有事件的CSS 
// files - 然后筛选的'change'和重载所有
// css文件在页面上
bs.watch("css/*.css", function (event, file) {
    if (event === "change") {
        bs.reload("*.css");
    }
});

// 现在初始化的Browsersync服务器
bs.init({
    server: "./app"
});
```

### SASS + CSS 注入
通过流的方式创建任务流程, 这样您就可以在您的任务完成后调用reload，所有的浏览器将被告知的变化并实时更新。
```
var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var reload      = browserSync.reload;

// 静态服务器 + 监听 scss/html 文件
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./app"
    });

    gulp.watch("app/scss/*.scss", ['sass']);
    gulp.watch("app/*.html").on('change', reload);
});

// scss编译后的css将注入到浏览器里实现更新
gulp.task('sass', function() {
    return gulp.src("app/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("app/css"))
        .pipe(reload({stream: true}));
});

gulp.task('default', ['serve']);
```
### 浏览器重载
```
// 处理完JS文件后返回流
gulp.task('js', function () {
    return gulp.src('js/*js')
        .pipe(browserify())
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

// 创建一个任务确保JS任务完成之前能够继续响应
// 浏览器重载
gulp.task('js-watch', ['js'], browserSync.reload);

// 使用默认任务启动Browsersync，监听JS文件
gulp.task('serve', ['js'], function () {

    // 从这个项目的根目录启动服务器
    browserSync({
        server: {
            baseDir: "./"
        }
    });

    // 添加 browserSync.reload 到任务队列里
    // 所有的浏览器重载后任务完成。
    gulp.watch("js/*.js", ['js-watch']);
});
```
