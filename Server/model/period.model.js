// models/Period.js
import { Schema, model } from 'mongoose';

const periodSchema = new Schema({
  school:{type:Schema.ObjectId, ref:'School'},
  teacher: {   type: Schema.Types.ObjectId,  ref: 'Teacher',   required: true, },
  subject: { type: Schema.Types.ObjectId, ref: 'Subject',  },
  class: { type: Schema.Types.ObjectId, ref: 'Class', required: true,},
  startTime: { type: Date, required: true,},
  endTime: { type: Date,  required: true,
  },
}, { timestamps: true });

export default model('Period', periodSchema);
