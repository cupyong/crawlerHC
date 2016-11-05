/**
 * 目录
 */
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let NavSchema  = new Schema({
    nav_id:{
        type: Schema.Types.ObjectId
    },
    name:String,
    url:String,
    level:Number,
    parent_id:String
})
module.exports = mongoose.model('Nav',NavSchema);