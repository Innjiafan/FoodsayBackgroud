'use strict'

const fs = require('fs');
const path = require('path');
const mongoose=require('mongoose');
// const Promise = require("bluebird");
// Promise.promisifyAll(require("mongoose"));
mongoose.connect('mongodb://localhost/foodsay')
let db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'));

let models_path = path.join(__dirname,'/app/models')

//require('./app/models/user')
let walk = function(modelPath){
	fs.readdirSync(modelPath)
	  .forEach(function(file){
	  	let filePath = path.join(modelPath,'/'+file)
	  	let stat = fs.statSync(filePath)

	  	if(stat.isFile()){
	  		if(/(.*)\.(js|coffee)/.test(file)){
	  			require(filePath)
	  		}
	  	}else if(stat.isDirectory()){
	  		walk(filePath)
	  	}

	  })
}

walk(models_path)

const Koa = require('koa');
const logger = require('koa-logger');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
const json = require('koa-json');

let router = require('./config/routes.js')()

//const Router = require('koa-router');

const app = new Koa();


app.keys=['foodsay']
app.use(logger())
app.use(session(app))
app.use(bodyParser())
app.use(json())
app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(1234)
console.log('listening:1234')
