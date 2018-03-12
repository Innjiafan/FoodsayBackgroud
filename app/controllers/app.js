 'use strict'
 
const qiniu = require("qiniu");
const uuid  = require('uuid/v4')
let accessKey = 'Ms4EVehkUYpCtLSL348spUDt8mNGPxWQvNwlMKv7';
let secretKey = 'y9UO2l0tzIGh8eIU6w09AgGiQ8NvXNWxuCiNXuJl';
let mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

// let config = new qiniu.conf.Config();
// // 空间对应的机房
// config.zone = qiniu.zone.Zone_z2;
// // 是否使用https域名
// //config.useHttpsDomain = true;
// // 上传是否使用cdn加速
// //config.useCdnDomain = true;
module.exports = {
	async signature(ctx,next){
	  	let body = ctx.request.body 
	  	let cloud = body.cloud
	  	let type= body.type
	  	//console.log(type)
	  	let options
	  	let putPolicy
		let uploadToken
		if(cloud === 'qiniu' ){
			  	//qiniu
			let key=uuid()
			if(type === 'avatar'){
				key += '.jpeg'
				options={
					scope:'foodavatar'
				}
				putPolicy = new qiniu.rs.PutPolicy(options);
				uploadToken=putPolicy.uploadToken(mac)
			}else if(type === 'video'){
				key+='.mp4'
				let saveMp4Entry = qiniu.util.urlsafeBase64Encode('foodvideo' + ":"+key)
				//let saveJpgEntry = qiniu.util.urlsafeBase64Encode('foodvideo' + ":"+key+'.jpg');
				let avthumbMp4Fop = "avthumb/mp4|saveas/" + saveMp4Entry;
				//let vframeJpgFop = "vframe/jpg/offset/7/w/480/h/360|saveas/" + saveJpgEntry
				options = {
				  scope: 'foodvideo',
				  //将多个数据处理指令拼接起来
				  persistentOps: avthumbMp4Fop,
				  //数据处理队列名称，必填
				  persistentPipeline: "video-pipe",
				  //数据处理完成结果通知地址
				  //persistentNotifyUrl: "http://api.example.com/qiniu/pfop/notify",
				}

				putPolicy = new qiniu.rs.PutPolicy(options);
				uploadToken=putPolicy.uploadToken(mac)
				//console.log(uploadToken)
			}else if(type === 'file'){

			}
			ctx.body={
				success:true,
				data:{
					token:uploadToken,
					key:key
				}
			}
		}else{
			let type = body.type
			let timestamp = body.timestamp
			let folder
			let tags

		  	if(type === 'avatar'){
		  		folder = 'avatar'
		  		tags = 'app,avatar'
		  	}else if(type === 'video'){
		  		folder = 'video'
		  		tags = 'app,video'
		  	}
		  	let signature = 'folder='+folder+'&tags='+tags+'&timestamp='+timestamp+config.CLOUDINARY.api_secret
		  	signature = sha1(signature)

		  	ctx.body = {
		  		success:true,
		  		signature:signature
		  	}
		}

	}
}