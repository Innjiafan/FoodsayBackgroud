'use strict'

const mongoose = require('mongoose')
const session = require('koa-session')
const xss = require('xss')
//const uuid  = require('uuid/v4')

let Video = mongoose.model('Video')
let User = mongoose.model('User')
var userFields = [
  'avatar',
  'nickname'
]
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
				video = new Video({
					author:user._id,
					qiniu_key:videoData.key,
					persistentId:videoData.persistentId,
					video:"http://p3pxaqk2z.bkt.clouddn.com/"+videoData.key,
				    thumb:"http://p3pxaqk2z.bkt.clouddn.com/"+videoData.key+"?vframe/jpg/offset/0/w/460/h/320",
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
	  let page = parseInt(ctx.request.body.page,10)||1
	  var count = 3
	  var offset = (page - 1) * count

	  var queryArray = [
	    await Video
	      .find({})
	      .sort({
	        'meta.createAt': -1
	      })
	      .skip(offset)
	      .limit(count)
	      .populate({
			  path: 'author',
			  select: 'avatar nickname',
			})
	      .exec(),
	    await Video.count({}).exec()
	  ]

	  var data = queryArray
	  //console.log(data)
	  ctx.body = {
	    success: true,
	    data: data[0],
	    total: data[1]
	  }
	

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
		
	},

	async userDetail(ctx,next){
		let body = ctx.request.body
		let _id = body._id
		await User.findOne({_id:_id},function(err,user){
			console.log(user)
			ctx.body = {
				success:true,
				data:user
			}
		})
		
	},
}
