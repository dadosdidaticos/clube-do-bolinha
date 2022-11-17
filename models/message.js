const mongoose = require('mongoose')
const Schema = mongoose.Schema
const MessageSchema = new Schema({
    user:{ type: Schema.Types.ObjectId, ref: "User", required: true },
    title:{ type:String, required:true},
    message:{type:String, required: true},
    time_stamp:{type: Date, default: Date.now}
})

module.exports = mongoose.model("User",UserSchema) 