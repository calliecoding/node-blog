const mongoose = require('mongoose');

let contentSchema = new mongoose.Schema({
    title:String,
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    description:String,
    content:String,
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'categories'
    },
    time:{
        type:Date,
        default:new Date()
    },
    view:{
      type:Number,
      default:0
    },
    comment:{
        type:Array,
        default:[]
    }
})

module.exports = mongoose.model('contents',contentSchema)