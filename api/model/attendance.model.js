import { Schema, model } from 'mongoose';

const attendanceSchema = new Schema({
  school:{type:Schema.ObjectId, ref:'School'},
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  class:{type:Schema.Types.ObjectId, ref:"Class"},
  date: { type: Date, required: true },
  status: { type: String, enum: ['Present', 'Absent'], default: 'Absent' }
}, { timestamps: true });

export default model('Attendance', attendanceSchema);
