'use strict'

const mongoose = require('mongoose')

let UserSchema = new mongoose.Schema({
    nickname:{
    	unique:true,
    	type:String
    },
    areaCode:String,
    password:String,
    accessToken:String,
    phoneNumber:String,
    gender:String,
    age:String,
    avatar:String,
    description:String,
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
UserSchema.pre('save', function (next) {
  //console.log(this.isNew)
  if(this.isNew){
  	this.meta.createAt = this.meta.updateAt = Date.now()
  }else{
    this.meta.updateAt = Date.now()
  }
  next();
});
module.exports =  mongoose.model('User',UserSchema)

