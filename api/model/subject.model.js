import { Schema, model } from "mongoose";

const subjectSchema = new Schema({
    school:{type:Schema.ObjectId, ref:'School'},
    subject_name:{type:String, required:true},
    subject_codename:{type:String,required:true},
    createdAt:{type:Date, default:new Date()}

})

export default model("Subject", subjectSchema)