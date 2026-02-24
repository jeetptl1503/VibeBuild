import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema({
    teamName: { type: String, required: true },
    leaderId: { type: String, required: true },
    leaderName: { type: String, required: true },
    members: [{
        name: { type: String, required: true },
        userId: { type: String, required: true },
    }],
    domain: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Team || mongoose.model('Team', TeamSchema);
