'use strict'
const Router = require('koa-router')

let App = require('../app/controllers/app.js')
let User = require('../app/controllers/user.js')
let Creation = require('../app/controllers/creation.js')
let Detail = require('../app/controllers/detail.js')
module.exports = function(){
	let router = new Router({
	  prefix: '/api/'
	})
	//user
	router.post('u/regist',User.regist)
	router.post('u/login',User.login)
	router.post('u/update',User.update)

	//app
	router.post('signature', App.signature)
	router.post('creations/video',Creation.video)
	router.post('creations/list',Creation.list)
	router.post('creations/vote',Creation.vote)

	//评论
	router.post('detail/comments',Detail.addcomments)
	router.get('detail/commentslist',Detail.commentslist)

	return router
}
