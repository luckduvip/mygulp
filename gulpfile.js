var gulp = require('gulp')
	,keyword = "sssb"
	,minimist = require("minimist")
	,sass = require("gulp-sass")
	,uglify = require("gulp-uglify")
	,minifyPipeline = require('pipeline-minify-js')
	,concat = require("gulp-concat")
	,tmodjs = require("gulp-tmod")
	,rename = require("gulp-rename")
	,replace = require("gulp-replace")
	,sourcemaps = require('gulp-sourcemaps')
	,watch = require('gulp-watch')
	,baseUrl = require("./config.js")
	,jshint = require("gulp-jshint")
	,config = {
		mogo12 : {
			scss : {
				input_folder : "scss/base.scss"
				,output_folder : "css/"
			}
			,js : {
				input_folder : ['js/lib/*.js','js/tools/*.js','js/htmls/*.js']
				,output_name : "dist.js"
				,output_folder : "js/min/"
			}
			,tmod : {
				input_folder : "tpl/**/*.html"
				,output_folder : "js/min"
			}
			,watch : {
				watchList : ["tmod/tpl/**/*.html","tmod/myHelp.js","scss/","scss/**/*.*","js/lib/*.*","js/tools/**/*.js","js/htmls/**/*.*"]
				,callbackList : [
					{ key : /tmod\/myHelp\.js/i , callback : "project" , params : "mogo12" }
					,{ key : /tmod\/tpl/i , callback : "project" , params : "mogo12" }
					,{ key : /scss\/[\w_]+\.scss/i , callback : "project" , params : "mogo12" }
					,{ key : /js\/lib\/[\w_]+\.js/i , callback : "project" , params : "mogo12" }
					,{ key : /js\/htmls\/[\w_]+\.js/i , callback : "project" , params : "mogo12" }
					,{ key : /js\/tools\/[\w_]+\.js/i , callback : "project" , params : "mogo12" }
				]
			}
		},
		mogo : {
			scss : {
				input_folder : "scss/base.scss"
				,output_folder : "css/"
			}
			,js : {
				input_folder : ['js/lib/*.js','js/tools/*.js','js/htmls/*.js']
				,output_name : "dist.js"
				,output_folder : "js/min/"
			}
			,tmod : {
				input_folder : "tpl/**/*.html"
				,output_folder : "js/min"
			}
			,watch : {
				watchList : ["tmod/tpl/**/*.html","tmod/myHelp.js","scss/","scss/**/*.*","js/lib/*.*","js/tools/**/*.js","js/htmls/**/*.*"]
				,callbackList : [
					{ key : /tmod\/myHelp\.js/i , callback : "project" , params : "mogo" }
					,{ key : /tmod\/tpl/i , callback : "project" , params : "mogo" }
					,{ key : /scss\/[\w_]+\.scss/i , callback : "project" , params : "mogo" }
					,{ key : /js\/lib\/[\w_]+\.js/i , callback : "project" , params : "mogo" }
					,{ key : /js\/htmls\/[\w_]+\.js/i , callback : "project" , params : "mogo" }
					,{ key : /js\/tools\/[\w_]+\.js/i , callback : "project" , params : "mogo" }
				]
			}
		},
		mogo_h5 : {
			scss : {
				input_folder : "scss/base.scss"
				,output_folder : "css/"
			}
			,js : {
				input_folder : ['js/lib/*.js','js/tools/*.js','js/htmls/*.js']
				,output_name : "dist.js"
				,output_folder : "js/min/"
			}
			,tmod : {
				input_folder : "tpl/**/*.html"
				,output_folder : "js/min"
			}
			,watch : {
				watchList : ["tmod/tpl/**/*.html","tmod/myHelp.js","scss/","scss/**/*.*","js/lib/*.*","js/tools/**/*.js","js/htmls/**/*.*"]
				,callbackList : [
					{ key : /tmod\/myHelp\.js/i , callback : "project" , params : "mogo_h5" }
					,{ key : /tmod\/tpl/i , callback : "project" , params : "mogo_h5" }
					,{ key : /scss\/[\w_]+\.scss/i , callback : "project" , params : "mogo_h5" }
					,{ key : /js\/lib\/[\w_]+\.js/i , callback : "project" , params : "mogo_h5" }
					,{ key : /js\/htmls\/[\w_]+\.js/i , callback : "project" , params : "mogo_h5" }
					,{ key : /js\/tools\/[\w_]+\.js/i , callback : "project" , params : "mogo_h5" }
				]
			}
		}
	}
gulp.task("project_sign_jshint",function(input){
	return gulp.src(input)
		.pipe(jshint(".jshintrc"))
		.pipe(jshint.reporter('default'));
})
gulp.task("project_jshint",function(url,config){
	var input = [];
	for(var i=0;i<config.input_folder.length;i++){
		input.push(url+config.input_folder[i]);
	}
	return gulp.src(input)
		.pipe(jshint(".jshintrc"))
		.pipe(jshint.reporter('default'));
})
gulp.task('project_tmod',function(url,config){
	return gulp.src(url + "tmod/" +config.input_folder)
		.pipe(tmodjs({
			runtime : "template.min.js"
			,templateBase : url + "tmod/" +"tpl"
			,helpers : url + "tmod/" + "myHelp.js"
			,syntax: url + "tmod/" + "template-syntax.js"
			,charset: "utf-8"
			,escape: true
			,compress: true
			,type: "default"
			,combo: true
			,minify: true
			,cache: false
		}))
		.pipe(sourcemaps.init({loadMaps:true}))
		.pipe(uglify())
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest(url+config.output_folder));
})
gulp.task("project_javascripts",function(url,config){
	var input = [];
	for(var i=0;i<config.input_folder.length;i++){
		input.push(url+config.input_folder[i]);
	}
	return gulp.src(input)
		.pipe(sourcemaps.init({loadMaps:true}))
		.pipe(concat(config.output_name))
		.pipe(rename(function(path){
			path.extname = ".min.js";
		}))
		.pipe(uglify())
		.on("error",function(err){
			console.error("-----------------------------------------------------------uglify error",err.message,"------------------------------------------------------------------------------");

			this.end();
		})
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest(url+config.output_folder));
})
gulp.task("project_scss",function(url,config){
	return gulp.src(url+config.input_folder)
		.pipe(sourcemaps.init({loadMaps:true}))
		.pipe(sass({outputStyle:'compressed'}).on('error',sass.logError))
		.pipe(rename(function(path){
			path.extname = ".min.css"
		}))
		.pipe(sourcemaps.write("./maps"))
		.pipe(gulp.dest(url+config.output_folder));
})
gulp.task("uglifyFile",function(){
	var url = getInputParams("fileurl"),output = url.substring(0,url.lastIndexOf("\/")+1);
	/*
	 *console.log(url,output);
	 */
	return gulp.src(url)
		.pipe(sourcemaps.init({loadMaps:true}))
		.pipe(uglify())
		.pipe(rename(function(path){
			path.extname = ".min.js";
		}))
		.pipe(sourcemaps.write("./maps"))
		.pipe(gulp.dest(output));
})
gulp.task("sass",function(){
	return gulp.src(gulp.info.baseUrl+gulp.info.css.input)
		.pipe(sourcemaps.init({loadMaps:true}))
		.pipe(sass({outputStyle:'compressed'}).on('error',sass.logError))
		.pipe(rename(function(path){
			path.extname = ".min.css"
		}))
		.pipe(sourcemaps.write("./maps"))
		.pipe(gulp.dest("./test/css/"));
});
//替换时间戳,替换单个文件
gulp.task("replaceFile",function(){
	var url = getInputParams("fileurl"),output = url.substring(0,url.lastIndexOf("\/")+1);
	return gulp.src(url)
		.pipe(replace(/(\.(?:jpg|png|gif)\?)(\d+)/g,"$1"+Date.now()))
		.pipe(gulp.dest(output));
});
//替换时间戳,替换项目
gulp.task("replaceAll",function(){
	var url = getInputParams("fileurl"),
	key = getInputParams("key"),
	val = getInputParams("val");
	return gulp.src([url+"**/*.js",url+"**/*.html",url+"**/*.scss"])
		.pipe(replace(key,val))
		.pipe(gulp.dest(url));
})
//替换时间戳,替换项目
gulp.task("replace",function(){
	var url = getInputParams("fileurl");
	console.error(url);
	return gulp.src([url+"**/*.js",url+"**/*.html",url+"**/*.scss"])
		.pipe(replace(/(\.(?:jpg|png|gif)\?)(\d+)/g,"$1"+Date.now()))
		.pipe(gulp.dest(url));
})
gulp.task("uglify",function(){
	return gulp.src(gulp.info.baseUrl+gulp.info.js.input)
		.pipe(sourcemaps.init({loadMaps:true}))
		.pipe(uglify())
		.pipe(rename(function(path){
			path.extname = ".min.js"
		}))
		.pipe(sourcemaps.write("./maps"))
		.pipe(gulp.dest(gulp.info.baseUrl+gulp.info.js.output));
})
gulp.task("sassFile",function(){
	var url = getInputParams("fileurl"),output = url.substring(0,url.lastIndexOf("\/")+1);
	return gulp.src(url)
		.pipe(sourcemaps.init({loadMaps:true}))
		.pipe(sass({outputStyle:'compressed'}).on('error',sass.logError))
		.pipe(rename(function(path){
			path.extname = ".min.css";
		}))
		.pipe(sourcemaps.write("./maps"))
		.pipe(gulp.dest(output));
})
gulp.task('myWatch',function(){
	var project_name = getInputParams('fileurl'),_watch_config = config[project_name].watch;
	console.log(project_name,baseUrl[project_name]);
	for(var i =0;i<_watch_config.watchList.length;i++){
		_watch_config.watchList[i] = baseUrl[project_name]+ _watch_config.watchList[i];
	}
	return watch(_watch_config.watchList,function(e){
		console.log("the event infos iss.....",e.event,e.history,"the time is =====",new Date().toLocaleString());
		if(/\.js$/.test(e.history.join(""))){
			gulp.tasks["project_sign_jshint"].fn(e.history);
		}
		for(var val of _watch_config.callbackList){
			if(val.key.test(e.path)){
				gulp.tasks[val.callback].fn(val.params);
				break;
			}
		}
	})
})
gulp.task('_jshint',function(_projectName){ 
	var project_name = getInputParams("fileurl");
	gulp.tasks["project_jshint"].fn(baseUrl[project_name],config[project_name].js);
})
gulp.task('project',function(_projectName){ 
	if(_projectName && !(_projectName instanceof Function)){
		var project_name = _projectName;
	}else{
		project_name = getInputParams("fileurl");
	}
	gulp.tasks["project_javascripts"].fn(baseUrl[project_name],config[project_name].js);
	gulp.tasks["project_scss"].fn(baseUrl[project_name],config[project_name].scss);
	gulp.tasks["project_tmod"].fn(baseUrl[project_name],config[project_name].tmod);
	return;
});
var getInputParams = function(args){
	return minimist(process.argv.slice(2),args)[args];
},getParams = function(){
	console.log(minimist(process.argv.slice(2)));
}
