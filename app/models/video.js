'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const Mixed = Schema.Types.Mixed
let VideoSchema = new Schema({
    author:{
      type:ObjectId,
      ref:'User'
    },
    qiniu_key:String,
    //renwuid
    persistentId:String,
    qiniu_detail:Mixed,

    video:String,
    thumb:String,
    title:String,
    voted:Boolean,
    //cloudary资源文件名
    // puclic_id:String,
    // detail:Mixed,

    meta:{
    	createAt:{
    		type:Date,
    		default:Date.now
    	},
    	updateAt:{
    		type:Date,
    		default:Date.now
    	}
    }
});
VideoSchema.pre('save', function (next) {
  //console.log(this.isNew)
  if(this.isNew){
  	this.meta.createAt = this.meta.updateAt = Date.now()
  }else{
    this.meta.updateAt = Date.now()
  }
  next();
});
module.exports =  mongoose.model('Video',VideoSchema)

