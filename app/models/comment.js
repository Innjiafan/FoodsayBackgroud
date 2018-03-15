'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

let CommentSchema = new Schema({
   replyBy:{
      type:ObjectId,
      ref:'User'
    },
    //评论内容
    content:String,
    videoBy:{
      type:ObjectId,
      ref:'Video'
    },
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
CommentSchema.pre('save', function (next) {
  //console.log(this.isNew)
  if(this.isNew){
  	this.meta.createAt = this.meta.updateAt = Date.now()
  }else{
    this.meta.updateAt = Date.now()
  }
  next();
});
module.exports =  mongoose.model('Comment',CommentSchema)

