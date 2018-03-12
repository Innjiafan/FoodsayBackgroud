'use strict'

const mongoose = require('mongoose')
const xss = require('xss')
const uuid  = require('uuid/v4')

let User = mongoose.model('User')

module.exports = {
	async regist(ctx,next){
		const { nickname,  password } = ctx.request.body
		console.log(!nickname||!password)
		if(!nickname||!password){
			console.log(111)
			ctx.body={
				success:false,
				msg:'用户名或密码为空'
			}
			return
		}
		await User.findOne({
			nickname: nickname
		},(err,user)=>{
			if(!user){
				let accessToken = uuid()
				user = new User({
					nickname:xss(nickname),
					password:xss(password),
					avatar:'file:///Users/jiafan/Downloads/avatar1.jpg',
					accessToken:accessToken,
				})
				user.save()
				ctx.body = {
					success:true,
					msg:'用户保存成功'
				}
			}else{
				ctx.body={
					success:false,
					msg:'您已经注册，请登录'
				}
			}
			
		})
		
	
	},
	async login(ctx,next){
		let nickname = ctx.request.body.nickname
		let password = ctx.request.body.password

		if(!nickname || !password){
			ctx.body = {
				success:false,
				msg:'用户名或密码为空'
			}
			return
		}
		await User.findOne({
			nickname:nickname
		},(err,user)=>{
			if(err){
					throw err
				}
				if(!user){
					ctx.body = {
						success:false,
						msg:'用户不存在'
					}
				}else{
					if(password === user.password){
						ctx.body = {
							success:true,
							msg:'登入成功',
							data:{
								nickname:user.nickname,
								password:user.password,
								avatar:user.avatar,
								accessToken:user.accessToken,
								_id:user._id
							}
						}
					}else{
						ctx.body={
							success:false,
							msg:'密码错误'
						}
					}
				}
		})
		
	},
	async update(ctx,next){
		let body = ctx.request.body
		let accessToken = body.accessToken
		if(!accessToken){
			ctx.body = {
				success:false,
				msg:'钥匙不存在'
			}
			return
		}
		await User.findOne({
			accessToken:accessToken
		},(err,user)=>{
			if(err) throw err
			if(!user){
				ctx.body = {
					success:false,
					msg:'用户不存在'
				}
			}
			let fields = 'avatar,gender,nickname,age,phoneNumber,description,password'.split(',')
			fields.forEach((field)=>{
				if(body[field]){
					user[field]=xss(body[field]).trim()
				}
			})

			user.save()

			ctx.body = {
				success:true,
				data:{
					nickname:user.nickname,
					password:user.password,
					avatar:user.avatar,
					accessToken:user.accessToken,
					gender:user.gender,
					age:user.age,
					description:user.description,
					phoneNumber:user.phoneNumber,
					_id:user._id
				}
			}
		})
	}
}
