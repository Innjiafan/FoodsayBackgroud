'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

let ArticleSchema = new Schema({
   title:String,
   articlethumb:String,
   desc:String,
   author:{
      type:ObjectId,
      ref:'User'
    },
    stepImage:[],
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
ArticleSchema.pre('save', function (next) {
  //console.log(this.isNew)
  if(this.isNew){
  	this.meta.createAt = this.meta.updateAt = Date.now()
  }else{
    this.meta.updateAt = Date.now()
  }
  next();
});
module.exports =  mongoose.model('Article',ArticleSchema)

