## gulp 介绍
gulp是基于Nodejs的自动任务运行器， 她能自动化地完成 javascript、coffee、sass、less、html/image、css 等文件的测试、检查、合并、压缩、格式化、浏览器自动刷新、部署文件生成，并监听文件在改动后重复指定的这些步骤。在实现上，她借鉴了Unix操作系统的管道（pipe）思想，前一级的输出，直接变成后一级的输入，使得在操作上非常简单。
### gulp.src
```
gulp.src(globs[, options]);
```
gulp.src方法是用来获取文件流的，这个流里面的内容不是原始的文件流，而是一个虚拟的文件对象流（vinyl stream）,这个虚拟文件对象中存放着原始文件的路径，文件名，内容等信息。  
globs参数是文件匹配模式（类似正则表达式），用来匹配文件路径名（包括文件名），当然这里也可以指定某个具体的文件路径。当有多个匹配模式时，该参数可以是一个数组，类型为String或者Array。 
```
//使用数组的方式来匹配多种文件
gulp.src(['js/*.js','css/*.css','*.html'])
```
**1. globs匹配规则**
globs内部使用了node-globs模块来实现其模块匹配功能，可以使用下面这些字符来匹配我们想要的文件：  
```
1. \*	匹配文件路径中的0个或多个字符，但不会匹配路径分隔符，除非路径分隔符出现在末尾
2. **	匹配路径中的0个或多个目录及其子目录,需要单独出现，即它左右不能有其他东西了。如果出现在末尾，也能匹配文件。
3. ?	匹配文件路径中的一个字符(不会匹配路径分隔符)
4. [...]	匹配方括号中出现的字符中的任意一个，当方括号中第一个字符为^或!时，则表示不匹配方括号中出现的其他字符中的任意一个，类似js正则表达式中的用法
5. !(pattern|pattern|pattern)	匹配任何与括号中给定的任一模式都不匹配的
6. ?(pattern|pattern|pattern)	匹配括号中给定的任一模式0次或1次，类似于js正则中的(pattern|pattern|pattern)?
7. +(pattern|pattern|pattern)	匹配括号中给定的任一模式至少1次，类似于js正则中的(pattern|pattern|pattern)+
8. *(pattern|pattern|pattern)	匹配括号中给定的任一模式0次或多次，类似于js正则中的(pattern|pattern|pattern)*
9. @(pattern|pattern|pattern)	匹配括号中给定的任一模式1次，类似于js正则中的(pattern|pattern|pattern)
```
实例：  
```
\* 能匹配 a.js,x.y,abc,abc/,但不能匹配a/b.js

*.* 能匹配 a.js,style.css,a.b,x.y

*/*/*.js 能匹配 a/b/c.js,x/y/z.js,不能匹配a/b.js,a/b/c/d.js

** 能匹配 abc,a/b.js,a/b/c.js,x/y/z,x/y/z/a.b,能用来匹配所有的目录和文件

**/*.js 能匹配 foo.js,a/foo.js,a/b/foo.js,a/b/c/foo.js

a/**/z 能匹配 a/z,a/b/z,a/b/c/z,a/d/g/h/j/k/z

a/**b/z 能匹配 a/b/z,a/sb/z,但不能匹配a/x/sb/z,因为只有单**单独出现才能匹配多级目录

?.js 能匹配 a.js,b.js,c.js

a?? 能匹配 a.b,abc,但不能匹配ab/,因为它不会匹配路径分隔符

[xyz].js 只能匹配 x.js,y.js,z.js,不会匹配xy.js,xyz.js等,整个中括号只代表一个字符

[^xyz].js 能匹配 a.js,b.js,c.js等,不能匹配x.js,y.js,z.js
```

**2. options参数**
（1）options.buffer: 类型： Boolean 默认值： true    
如果该项被设置为 false，那么将会以 stream 方式返回 file.contents 而不是文件 buffer 的形式。这在处理一些大文件的时候将会很有用。注意：插件可能并不会实现对 stream 的支持。  
（2）options.read: 类型： Boolean 默认值： true  
如果该项被设置为false，那么file.contents会返回空值（null），也就是并不会去读取文件。  
（3）options.base: 类型：String 设置基础路径，输出路径会去掉基础路径，然后拼接路径，默认的基础路径是模糊匹配前面的路径，实例：
```
gulp.src('client/js/**/*.js') 
// 匹配 'client/js/somedir/somefile.js' 现在 `base` 的值为 `client/js/`
  .pipe(minify())
  .pipe(gulp.dest('build'));  
  //写入 'build/somedir/somefile.js' 将`client/js/`替换为build
 
gulp.src('client/js/**/*.js', { base: 'client' }) 
// 匹配 'client/js/somedir/somefile.js'  现在base 的值为 'client'
  .pipe(minify())
  .pipe(gulp.dest('build'));  
  // 写入 'build/js/somedir/somefile.js' 将`client`替换为build
  ```
### gulp.dest 写文件
```
gulp.dest(path[,options]);
```
path为写入文件的路径。可以将它 pipe 到多个文件夹。如果某文件夹不存在，将会自动创建它。
options为一个可选的参数对象，可以有以下属性： 
option.cwd： 类型： String 默认值： process.cwd()。输出目录的 cwd 参数，只在所给的输出目录是相对路径时候有效。
options.mode: 类型： String 默认值： 0777。八进制权限字符，用以定义所有在输出目录中所创建的目录的权限。 
```
var gulp = require('gulp');
gulp.src('script/jquery.js')　       // 获取流
    .pipe(gulp.dest('dist/foo.js')); // 写放文件
```

文件路径与我们给_gulp.dest()_方法传入的路径参数之间的关系:_gulp.dest(path)_生成的文件路径是我们传入的_path_参数后面再加上_gulp.src()_中有通配符开始出现的那部分路径（在不设置src中options.base的情况下）。

### gulp.task 定义任务
```
gulp.task(name [, deps] [, fn])
```
name： 类型： String 任务名称  
deps： 类型： Array 在该任务开始执行之前需要执行的任务列表。
fn：回调函数，任务的主要操作在这里完成，deps执行完成以后执行的函数，确保在deps（dependency tasks）任务执行完成以后才执行该任务。
```
gulp.task('mytask', ['array', 'of', 'task', 'names'], function() {
  // Do stuff
});
```
如果只是想执行一些任务列表，可以省略fn参数。
```
gulp.task('build', ['array', 'of', 'task', 'names']);
```
这里的任务会并行执行，并不是按照数组的先后顺序来执行。 

### gulp.watch 
```
gulp.watch(glob[, opts, cb]);
```
glob: 类型： String或者Array。监听的文件或者文件列表的匹配模式。
cb: 回调函数，当监控的文件内容有变化时触发。该函数有一个参数，是一个event对象，该对象描述了文件的变化，有以下属性：
1. event.type: 文件发生变化的类型：added,changed,deleted,renamed.
2. event.path: 发生变化的文件的路径。

```
gulp.watch(glob[, opts], tasks)
```
glob和opts同gulp.watch(glob[, opts, cb]);里的参数。  
tasks是一个数组，表示需要在文件变动后执行的一个或者多个通过 gulp.task() 创建的 task 的名字。

```
var watcher = gulp.watch('js/**/*.js', ['uglify','reload']);
watcher.on('change', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});
```






























