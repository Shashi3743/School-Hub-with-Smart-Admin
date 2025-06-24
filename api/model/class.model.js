import { Schema, model } from "mongoose";
const asignSubTeachSchema =new Schema({
    subject:{type:Schema.ObjectId, ref:'Subject'},
    teacher:{type:Schema.ObjectId, ref:"Teacher"}
})
const classSchema = new Schema({
    school:{type:Schema.ObjectId, ref:'School'},
    class_text:{type:String, required:true},
    class_num:{type:Number,required:true},
    asignSubTeach:[asignSubTeachSchema],
    attendee:{type:Schema.ObjectId, ref:'Teacher', required:false},
    createdAt:{type:Date, default:new Date()}

})

export default model("Class", classSchema)