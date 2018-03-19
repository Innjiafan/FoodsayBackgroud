'use strict'

const mongoose = require('mongoose')
const session = require('koa-session')
const xss = require('xss')
//const uuid  = require('uuid/v4')

let Video = mongoose.model('Video')
let User = mongoose.model('User')
let Comment = mongoose.model('Comment')

module.exports = {
	 async addcomments(ctx,next){
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
		await User.findOne({accessToken:accessToken},function(err,user){
			userid = user._id
			console.log(user)
			ctx.body = {
				success:true,
				data:user
			}
		})

		let comment = new Comment({
			replyBy:userid,
			videoBy:videoId,
			content:content
		})

		await comment.save(function(err,comment){
			//console.log(comment)
			if(err) console.log(err)
		})
	},
	 async commentslist(ctx,next){
		let videoId = ctx.query.videoId 
		let page = parseInt(ctx.query.page,10)||1
	  var count = 3
	  var offset = (page - 1) * count

	  var queryArray = [
	    await Comment
	      .find({videoBy:videoId})
	      .sort({
	        'meta.createAt': -1
	      })
	      .skip(offset)
	      .limit(count)
	      .populate({
			  path: 'replyBy',
			  select: 'avatar nickname',
			})
	      .exec(),
	    await Comment.count({videoBy:videoId}).exec()
	  ]

	  var data = queryArray
//	  console.log(data)
	  ctx.body = {
	    success: true,
	    data: data[0],
	    total: data[1]
	  }
	}
}
