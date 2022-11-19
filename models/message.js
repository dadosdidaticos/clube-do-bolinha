const mongoose = require('mongoose')
const Schema = mongoose.Schema
const MessageSchema = new Schema({
    user:{ type: Schema.Types.ObjectId, ref: "users", required: true },
    title:{ type:String, required:true},
    message:{type:String, required: true, minLength:5, maxLength:500},
    time_stamp:{type: Date, default: Date.now}
})
MessageSchema.virtual('url').get(function(){
    return `/home/message/${this._id}`
})

module.exports = mongoose.model("Message",MessageSchema)