'use strict'

const mongoose = require('mongoose')
const session = require('koa-session')
const xss = require('xss')
//const uuid  = require('uuid/v4')

let Video = mongoose.model('Video')
let User = mongoose.model('User')
let Comment = mongoose.model('Comment')

module.exports = {
	 async comments(ctx,next){
	 	let body = ctx.request.body
		let accessToken = body.accessToken
		let videoId = body.list
		let content = body.content

		if(!accessToken||!videoId){
			//console.log(111)
			ctx.body={
				success:false,
				msg:'评论失败'
			}
			return
		}
		let userid
		await User.findOne({accessToken:accessToken}, function(err,user){
			userid = user._id
		})

		let comment = new Comment({
			replyBy:userid,
			videoBy:videoId,
			content:content
		})

		await comment.save(function(err,comment){
			console.log(comment)
			if(err) console.log(err)
			comment = comment
		})
		ctx.body = {
			success:true,
			data:comment
		}
	}

}
