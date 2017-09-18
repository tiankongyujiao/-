## gulp 介绍
```
gulp.src(globs[, options]);
```
gulp.src方法是用来获取文件流的，这个流里面的内容不是原始的文件流，而是一个虚拟的文件对象流（vinyl stream）,这个虚拟文件对象中存放着原始文件的路径，文件名，内容等信息。  
globs参数是文件匹配模式（类似正则表达式），用来匹配文件路径名（包括文件名），当然这里也可以指定某个具体的文件路径。当有多个匹配模式时，该参数可以是一个数组，类型为String或者Array。 
**globs匹配规则**
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
