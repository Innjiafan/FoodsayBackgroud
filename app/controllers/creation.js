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
		let page = ctx.request.body.page
		let hastotal = ctx.request.body.total 
		let count = 0,allpage = 0
		await Video.count({},function(err,co){
			count = co
			//console.log(count)
		})
		//console.log(video)
		//await next()
		if(page == 0){
			// await Video.find({},{_id:true,voted:true,author:true,video:true,thumb:true,title:true,meta:true},{skip: Number(hastotal)},function(err,video){
			// 	//console.log(video)
				
			// 	ctx.body={
			// 		success:true,
			// 		total:count,
			// 		data:video
			// 	}
			// })
		}else{
		await Video.find({},{_id:true,voted:true,author:true,video:true,thumb:true,title:true,meta:true},{skip:((page-1)*5),limit:5},async function(err,video){
				if(err){
						throw err
					}
				
				if(count/5 == 0){
					allpage = count/5
				}else{
					allpage = count/5+1
				}
				if(page>allpage){
					return
				}
				let opt = [
					{path:'author',select:'avatar nickname'}
				]

				await Video.populate(video,opt,function(err,v){
					//console.log(video)
					video = v
				})

				ctx.body={
					success:true,
					total:count,
					data:video
				}
				
			})
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
