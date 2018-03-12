'use strict'

const qiniu = require('qiniu')
let sha1 = require('sha1'); 
let config = require('../../config/config.js')
let accessKey = config.qiniu.AK;
let secretKey = config.qiniu.SK;
let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
let bucket = 'foodsayavatar'
// let options = {
//   scope: bucket,
//   returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
// };

// function uptoken(options,key){
// 	let putPolicy = new qiniu.rs.PutPolicy(options+':'+key)
// }
exports.getQiniuToken = function(key){
	let options = {
		scope:bucket+':'+key
	}
	let putPolicy = new qiniu.rs.PutPolicy(options)
	return  putPolicy.uploadToken(mac)	
}

exports.getCloudinaryToken = function(body ){ 
	  

	  return signature
}