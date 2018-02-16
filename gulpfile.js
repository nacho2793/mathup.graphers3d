var gulp = require('gulp'),
watch = require('gulp-watch'),
browserSync = require('browser-sync').create();

gulp.task('default', function(){
	console.log('Default task!');
});

gulp.task('html', function(){
	console.log('HTML');
});

gulp.task('watch', function(){
	browserSync.init({
		server:{
			baseDir: "./"
		}
	});
	watch('./index.html', function(){
		browserSync.reload();
	});
	watch('./*.js', function(){
		browserSync.reload();
	});
	watch('./*.css', function(){
		browserSync.reload();
	});
});