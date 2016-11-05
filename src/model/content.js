/**
 * 内容
 */
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let ContentSchema  = new Schema({
    content_id:{
        type: Schema.Types.ObjectId
    },
    title:String,
    url:String,
    content:String,
    date:String,
    parent_id:String,
    content_date:Date
})
module.exports = mongoose.model('Content',ContentSchema);