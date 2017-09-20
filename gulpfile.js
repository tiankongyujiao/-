var gulp = require('gulp'),
	path = require('path'),
	fs = require('fs'),
	gulpif = require('gulp-if'),
	sass = require('gulp-ruby-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	// jshint = require('gulp-jshint'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	spritesmith = require('gulp.spritesmith'),
	gulpif = require('gulp-if'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	notify = require('gulp-notify'),
	cache = require('gulp-cache'),
	template = require('gulp-template'),
	livereload = require('gulp-livereload'),
	argv = require('yargs').argv,
	browserSync = require('browser-sync').create(),
	reload = browserSync.reload,
	uglify = require('gulp-uglify'),
	del = require('del');

function buildEndProcess(taskDes){
   console.log(taskDes+"完成");
}

//项目初始化 end
//eg1. gulp init -p zjtest 
//eg2. gulp init -p zjtest -n myPage
gulp.task('init', function() {
    var files = ["template/**/*"];
    var projectName = argv.p;
    var pageName = argv.n;
    if (pageName != undefined) {
        files = ['template/src/index.html', 'template/src/js/index.js', 'template/src/scss/index.scss','template/src/index.php']
    } else {
        pageName = 'index';
    }

    //如果对应的文件存在那么就什么也不做，防止对原来修改文件的破坏
    if(fs.existsSync('./'+projectName+"/src/"+pageName+".html")) return;

    gulp.src(files)
        .pipe(template({
            projectName: projectName,
            pageName: pageName
        }))
        .pipe(rename(function(path) {
            if (pageName == 'index') return;
            path.basename = pageName;
            //针对单独生成页面的处理
            if (path.extname == '.html'||path.extname == '.php') path.dirname = '/src';
            if (path.extname == '.js') path.dirname = '/src/js';
            if (path.extname == '.scss') path.dirname = '/src/scss';
            if (path.extname == '.txt') path.dirname = '/src';
        }))
        .pipe(gulp.dest('./' + projectName));
});

//压缩css
//eg1. gulp compcss -p zjtest
gulp.task('compcss',function(){
	var projectName = argv.p;
	return gulp.src(projectName + '/src/css/*.css')
		.pipe(rename({suffix:'.min'}))
		.pipe(minifycss())
		.pipe(gulp.dest(projectName + '/dist/css'))
		.pipe(notify({message:'styles task complete'}));
});

//压缩js
//eg1. gulp compjs -p zjtest
gulp.task('compjs',function(){
	var projectName = argv.p;
	return gulp.src(projectName + '/src/js/*.js')
		.pipe(rename({suffix:'.min'}))
		.pipe(uglify())
		.pipe(gulp.dest(projectName + '/dist/js'));
});

//压缩js，css
//eg1. gulp build -p zjtest
gulp.task('build',function(){
	gulp.start('compcss','compjs','compimage');
});

//压缩图片 images
//eg1. gulp 
gulp.task('compimage',function(){
	var projectName = argv.p;
	gulp.src(projectName + '/src/images/*.{png,jpg,gif}')
		.pipe(imagemin({
            progressive: true,
            interlaced: true,
            use: [pngquant()]
        }))
        .pipe(gulp.dest(projectName + '/dist/images/'));
    buildEndProcess("图片压缩");
});

//watch css
//eg1. gulp wscss -p zjtest
gulp.task('wscss',function(){
	var projectName = argv.p;
	complieSass(projectName,projectName + '/src/scss/*.scss');
	gulp.watch(projectName + '/src/scss/*.scss',function(event){
		var type = event.type;
		var pathScss = event.path;
		var scssName = path.basename(pathScss);
		if(type == 'deleted'){
			fs.exists(projectName + scssName.replace('.scss','.css'),function(exists){
				if(exists){
					fs.unlink(projectName + scssName.replace('.scss','.css'));
				}
			})
			return;
		}
		complieSass(projectName, projectName + '/src/scss/' + scssName);
	});
});
function complieSass(projectName,path){
	sass(path)
	.pipe(gulp.dest(projectName + '/src/css')).pipe(reload({stream: true}));//reload 注入sass scss
}

// 生成精灵图 sprites
//eg1. gulp sprites -p zjtest
gulp.task('sprites',function(){
	var projectName = argv.p;
	spritesGenerter(projectName,projectName + '/src/images/sprite/*.{png,jpg,gif}');
	gulp.watch(projectName + '/src/images/*.{png,jpg,gif}',function(){
		spritesGenerter(projectName,projectName + '/src/images/sprite/*.{png,jpg,gif}');
	});
});
function spritesGenerter(projectName,path){
	var spriteData = gulp.src(path).pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.css',
        padding:10
    }));
    return spriteData.pipe(gulp.dest(projectName + '/src/images/'));
}

//启动服务器
//eg1. gulp server -p zjtest
gulp.task('server',function(){
	var projectName = argv.p;

	browserSync.init({
		server:{
			baseDir:'./',
			index: projectName + '/src/index.html'
		}
	});
	gulp.watch(projectName + '/src/index.html').on('change',reload);
});

// 监听
//eg1. gulp watch -p zjtest
gulp.task('watch',function(){
	gulp.start('wscss');
	gulp.start('sprites');
	gulp.start('server');
})

//js合并
//eg. gulp ccscript -s zjtest/src/js/index.js,zjtest/src/js/index2.js -d zjtest/src/js/index.min.js 支持文件
gulp.task('ccscript', function() {
    var sourceUrl = argv.s;
    var dest = argv.d;
    var dirname = path.dirname(dest);
    var dname = path.basename(dest);
    if (sourceUrl.indexOf(",") != -1) {
        sourceUrl = "{" + sourceUrl + "}";
    }
    gulp.src(sourceUrl)
        .pipe(uglify())
        .pipe(concat(dname))
        .pipe(gulp.dest(dirname));
});
