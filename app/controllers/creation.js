'use strict'

const mongoose = require('mongoose')
const session = require('koa-session')
const xss = require('xss')
//const uuid  = require('uuid/v4')

let Video = mongoose.model('Video')
let User = mongoose.model('User')

module.exports = {
	async video(ctx,next){
		let body = ctx.request.body
		let videoData = body.video
		let user = body.user
		let title = body.title
		//console.log(user)

		if(!videoData || !videoData.key){
			//console.log(111)
			ctx.body={
				success:false,
				msg:'视频上传失败'
			}
			return
		}
		await Video.findOne({
			qiniu_key: videoData.key
		},(err,video)=>{
			if(!video){
				//console.log(111)
				video = new Video({
					author:user._id,
					qiniu_key:videoData.key,
					persistentId:videoData.persistentId,
					video:'http://p3pxaqk2z.bkt.clouddn.com/'+videoData.key,
				    thumb:'http://p3pxaqk2z.bkt.clouddn.com/'+videoData.key+'?vframe/jpg/offset/0/w/460/h/320',
				    title:title,
				    voted:false
				})
				video.save()
				ctx.body = {
					success:true,
					data:video._id,
					msg:'视频保存成功'
				}
			}else{
				ctx.body={
					success:false,
					msg:'视频已存在，保存失败'
				}
			}
			
		})
	},

	async list(ctx,next){
		let accessToken = ctx.query.accessToken
		await Video.find({},{_id:true,voted:true,author:true,video:true,thumb:true,title:true},function(err,video){
			// console.log(video.author)
			// User.findOne({_id:video.author},function(err,user){
			// 	console.log(user)
			// 	video.author.nickname = user.nickname
			// 	video.author.avatar = user.avatar
			// })
			ctx.body = {
				success:true,
				total:video.length,
				data:video
			}
		})
	},

	async vote(ctx,next){
		let body = ctx.request.body
		let id = body.id
		let up = body.up
		await Video.findOne({_id:id},function(err,video){
			video.voted = up
			video.save()
			ctx.body = {
				success:true
			}
		})
		
	}
}
