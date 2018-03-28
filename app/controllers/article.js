'use strict'

const mongoose = require('mongoose')
const session = require('koa-session')
const xss = require('xss')

let User = mongoose.model('User')
let Article = mongoose.model('Article')

module.exports = {
	 async addArticle(ctx,next){
	 	let body = ctx.request.body
		let author = body.accessToken
		let title = body.title
		let articlethumb = body.articlethumb
		let desc = body.desc
		let stepImage = body.stepImage

		if(!author||!title||!articlethumb||!desc){
			//console.log(111)
			ctx.body={
				success:false,
				msg:'发表文章失败'
			}
		}

		console.log(body)

		let userid
		await User.findOne({author:author},function(err,user){
			userid = user._id
		})
		//console.log(userid)
		let article = new Article({
			title:title,
			articlethumb:articlethumb,
			desc:desc,
			author:userid,
			stepImage:stepImage
		})

		await article.save(function(err,article){
			if(err) console.log(err)
		})

		ctx.body={
			success:true
		}
	},
	 async list(ctx,next){
	  let page = parseInt(ctx.query.page,10)||1
	  var count = 3
	  var offset = (page - 1) * count

	  var queryArray = [
	    await Article
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
	    await Article.count({}).exec()
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
