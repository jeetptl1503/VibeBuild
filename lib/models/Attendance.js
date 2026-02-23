import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
    participantName: { type: String, required: true },
    teamName: { type: String, required: true },
    email: { type: String, required: true },
    firstHalf: { type: Boolean, default: false },
    secondHalf: { type: Boolean, default: false },
    remarks: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);
