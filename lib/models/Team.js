import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema({
    teamId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    domain: { type: String, required: true },
    role: { type: String, enum: ['team', 'admin'], default: 'team' },
    members: [{ name: String, email: String }],
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Team || mongoose.model('Team', TeamSchema);
