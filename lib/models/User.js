import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['participant', 'admin'], default: 'participant' },
    needsPasswordSetup: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
