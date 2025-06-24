// models/Notice.js
import { Schema, model } from "mongoose";

const NoticeSchema = new Schema({
  school:{type:Schema.ObjectId, ref:'School'},
  title: { type: String, required: true },
  message: { type: String, required: true },
  audience: { type: String, enum: ["student", "teacher"], required: true },
  date: { type: Date, default: Date.now }
});

export default model("Notice", NoticeSchema);
