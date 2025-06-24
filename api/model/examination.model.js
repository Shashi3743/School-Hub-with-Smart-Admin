import { Schema, model } from "mongoose";

const examinationSchema = new Schema({
    school:{type:Schema.ObjectId, ref:'School'},
    examDate:{type:String,  required:true},
    subject:{type:Schema.ObjectId, ref:"Subject"},
    examType:{type:String, required:true},
    status:{type:String, default:'pending'},   
    class:{type:Schema.ObjectId, ref:"Class"},
    createdAt:{type:Date, default: new Date()}

})

export default model("Examination", examinationSchema)