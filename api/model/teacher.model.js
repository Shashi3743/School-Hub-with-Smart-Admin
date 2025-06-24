import { Schema, model } from "mongoose";

const teacherSchema = new Schema({
    school:{type:Schema.ObjectId, ref:'School'},
    email:{ type: String,  required:true },
    name:{type:String, required:true},
    qualification:{type:String, required:true},
    age:{type:String, required:true},
    gender:{type:String, required:true},
    teacher_image:{type:String,  required:true},
    createdAt:{type:Date, default: new Date()},

    password:{type:String, required:true}

})

export default model("Teacher", teacherSchema)