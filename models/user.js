const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserSchema = new Schema({
    username:{type:String, required: true},
    password:{type:String, required: true},
    first_name:{type:String, required: true},
    last_name:{type:String, required: true},
    membership_status:{type:Boolean,required:true, default:false},
    register_date:{type: Date, default: Date.now}
})

module.exports = mongoose.model("User",UserSchema) 